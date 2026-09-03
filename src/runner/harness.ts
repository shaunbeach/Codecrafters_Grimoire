// The Python side of the runtime. This string is exec'd once into the Pyodide
// interpreter; the worker then calls the __harness_* entry points per run.
//
// Responsibilities, in order of importance:
//   1. run the learner's code and report what happened, in their terms
//   2. observe what the code DID — the workspace diff — not just what it returned
//   3. leave no trace between runs, so project N+1 cannot inherit project N
export const HARNESS_PY = String.raw`
import sys, io, os, json, types, shutil, hashlib, linecache, traceback, builtins
import random, unittest

WORKSPACE = "/workspace"
USER_FILE = "solution.py"

# Frames from these files are plumbing, and showing them to a learner is noise.
_HIDDEN_SENTINELS = {"<harness>", "<tests>", "<setup>", "<string>", "<exec>", "<fixtures>"}


def _is_hidden(filename):
    if filename in _HIDDEN_SENTINELS:
        return True
    # unittest's own machinery lives in the stdlib; the learner never wrote it.
    return "/unittest/" in filename or filename.startswith("/lib/python")


class _Out(io.StringIO):
    """Replacement stdout/stderr. Optionally mirrors to the main thread."""

    def __init__(self):
        super().__init__()
        self.bridge = None

    def write(self, text):
        if self.bridge is not None and text:
            try:
                self.bridge(text)
            except Exception:
                pass
        return super().write(text)

    def writable(self):
        return True


# Set by the worker. _STDIN[0] blocks the whole worker thread until a line is
# typed; _STDOUT[0] mirrors output to the screen as it is produced.
_STDIN = [None]
_STDOUT = [None]


def __harness_set_bridges(stdin_fn, stdout_fn):
    _STDIN[0] = stdin_fn
    _STDOUT[0] = stdout_fn


class _InputQueue:
    """Scripted answers first, then a live prompt if one is available."""

    def __init__(self):
        self.items = []
        self.echo = True
        self.interactive = False
        self.grading = False

    def read(self, prompt=""):
        if prompt:
            sys.stdout.write(str(prompt))

        if self.items:
            value = self.items.pop(0)
            if self.echo:
                sys.stdout.write(value + "\n")
            return value

        if self.interactive and _STDIN[0] is not None:
            # Everything printed so far must be on screen before we block, or
            # the reader is looking at a frozen console with no prompt on it.
            sys.stdout.flush()
            value = _STDIN[0]()
            if value is None:
                raise EOFError("input() reached the end of the input.")
            value = str(value)
            sys.stdout.write(value + "\n")
            return value

        if self.grading:
            raise EOFError(
                "input() was called while your code was being graded, and there is "
                "nobody there to answer it. If you added a call at the bottom of "
                "your file to try things out, put it behind an "
                "'if __name__ == \"__main__\":' guard — then it runs when you press "
                "Run and is skipped when you press Check."
            )
        raise EOFError(
            "input() was called but there is no more input to give it."
        )


_inputs = _InputQueue()

# File kinds worth keeping a copy of, so a "modified" report can say WHAT
# changed rather than merely that something did.
DIFFABLE = {".xlsx", ".xlsm", ".csv", ".txt", ".json", ".md", ".py"}
MAX_KEEP_BYTES = 512 * 1024
_BEFORE_BYTES = {}

# Everything below is state the reset has to be able to undo.
_BASELINE = {"modules": set(sys.modules), "path": list(sys.path), "cwd": "/"}
_STUBS = {}
_BLOBS = {}
_EMITTED = []
_NOTES = []


# ---------------------------------------------------------------- tracebacks

def _register_source(name, src):
    lines = [line + "\n" for line in src.split("\n")]
    linecache.cache[name] = (len(src), None, lines, name)


def _strip(te, seen=None):
    seen = seen if seen is not None else set()
    if id(te) in seen:
        return
    seen.add(id(te))
    te.stack = traceback.StackSummary.from_list(
        [f for f in te.stack if not _is_hidden(f.filename)]
    )
    for child in (te.__cause__, te.__context__):
        if child is not None:
            _strip(child, seen)


def _format_traceback(exc, keep_hidden=False):
    te = traceback.TracebackException(type(exc), exc, exc.__traceback__)
    if not keep_hidden:
        _strip(te)
        # Nothing of the learner's own code is left, so a traceback would only
        # expose the hidden test suite. The headline says enough.
        if not te.stack and te.__cause__ is None and te.__context__ is None:
            return ""
    return "".join(te.format()).rstrip()


def _headline(exc):
    text = str(exc)
    return f"{type(exc).__name__}: {text}" if text else type(exc).__name__


# ---------------------------------------------------------------- workspace

def _ensure_workspace(path=WORKSPACE):
    os.makedirs(path, exist_ok=True)
    return path


def _fingerprint(path):
    """Size, mtime and a hash of the first megabyte.

    Hashing whole files on every run wastes real time on a 2 MB image, and this
    is only ever asked to answer "did the learner's program change this file".
    """
    stat = os.stat(path)
    digest = hashlib.sha1(stat.st_size.to_bytes(8, "little"))
    with open(path, "rb") as handle:
        digest.update(handle.read(1 << 20))
    return [stat.st_size, stat.st_mtime_ns, digest.hexdigest()]


def _snapshot(root=WORKSPACE, keep_bytes=False):
    _ensure_workspace(root)
    if keep_bytes:
        _BEFORE_BYTES.clear()

    tree = {}
    for folder, _dirs, files in os.walk(root):
        for name in files:
            full = os.path.join(folder, name)
            try:
                finger = _fingerprint(full)
            except OSError:
                continue
            relative = os.path.relpath(full, root)
            tree[relative] = finger

            if (
                keep_bytes
                and finger[0] <= MAX_KEEP_BYTES
                and os.path.splitext(name)[1].lower() in DIFFABLE
            ):
                try:
                    with open(full, "rb") as handle:
                        _BEFORE_BYTES[relative] = handle.read()
                except OSError:
                    pass
    return tree


# ---------------------------------------------------------------- previews

DEFAULT_LIMITS = {
    "maxFiles": 40,
    "maxBytesPerFile": 2 * 1024 * 1024,
    "maxTotalBytes": 8 * 1024 * 1024,
    "maxTextChars": 20000,
    "maxTableRows": 200,
    "maxSheetCells": 5000,
}

TEXT_EXTENSIONS = {".txt", ".md", ".log", ".py", ".html", ".htm", ".xml", ".ini", ".cfg", ".yml", ".yaml"}
IMAGE_EXTENSIONS = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                    ".gif": "image/gif", ".bmp": "image/bmp", ".webp": "image/webp"}


def _kind_for(path, data):
    ext = os.path.splitext(path)[1].lower()
    if ext in IMAGE_EXTENSIONS:
        return "image"
    if ext == ".csv":
        return "table"
    if ext == ".json":
        return "json"
    if ext == ".xlsx" or ext == ".xlsm":
        return "sheet"
    if ext == ".pdf":
        return "pdf"
    if ext == ".docx":
        return "document"
    if ext in (".zip", ".whl"):
        return "archive"
    if ext in TEXT_EXTENSIONS:
        return "text"
    # Fall back to sniffing: printable UTF-8 is text whatever it is called.
    try:
        data[:4096].decode("utf-8")
        return "text"
    except (UnicodeDecodeError, AttributeError):
        return "binary"


def _preview_text(path, data, limits):
    text = data.decode("utf-8", errors="replace")
    head = text[: limits["maxTextChars"]]
    return {"kind": "text", "head": head, "lineCount": text.count("\n") + 1,
            "truncated": len(text) > len(head)}


def _preview_table(path, data, limits):
    import csv as _csv
    text = data.decode("utf-8", errors="replace")
    rows = list(_csv.reader(io.StringIO(text)))
    if not rows:
        return {"kind": "table", "columns": [], "rows": [], "totalRows": 0}
    header, body = rows[0], rows[1:]
    return {
        "kind": "table",
        "columns": header,
        "rows": body[: limits["maxTableRows"]],
        "totalRows": len(body),
    }


def _preview_json(path, data, limits):
    text = data.decode("utf-8", errors="replace")
    try:
        value = json.loads(text)
    except ValueError as exc:
        return {"kind": "text", "head": text[: limits["maxTextChars"]],
                "lineCount": text.count("\n") + 1, "truncated": False,
                "note": f"not valid JSON: {exc}"}
    return {"kind": "json", "value": value, "totalBytes": len(data)}


def _preview_image(path, data, limits):
    ext = os.path.splitext(path)[1].lower()
    info = {"kind": "image", "mime": IMAGE_EXTENSIONS.get(ext, "image/png"),
            "width": 0, "height": 0, "mode": ""}
    try:
        from PIL import Image
        with Image.open(io.BytesIO(data)) as image:
            info["width"], info["height"] = image.size
            info["mode"] = image.mode
    except Exception:
        pass
    return info


def _sheet_cells(data):
    """{sheet name: {'B3': value}} — used to work out what actually changed."""
    from openpyxl import load_workbook
    from openpyxl.utils import get_column_letter

    book = load_workbook(io.BytesIO(data), data_only=True)
    out = {}
    for worksheet in book.worksheets:
        cells = {}
        for r, row in enumerate(worksheet.iter_rows(values_only=True), start=1):
            for c, value in enumerate(row, start=1):
                if value is not None:
                    cells[get_column_letter(c) + str(r)] = value
        out[worksheet.title] = cells
    return out


def _preview_sheet(path, data, limits, before=None):
    from openpyxl import load_workbook
    from openpyxl.utils import get_column_letter

    # Which cells the learner's code actually touched. This is the whole point
    # of showing a spreadsheet rather than saying "sales.xlsx was modified".
    changed = {}
    if before is not None:
        try:
            was, now = _sheet_cells(before), _sheet_cells(data)
            for name, cells in now.items():
                previous = was.get(name, {})
                marks = [ref for ref, value in cells.items() if previous.get(ref) != value]
                marks += [ref for ref in previous if ref not in cells]
                if marks:
                    changed[name] = sorted(set(marks))
        except Exception:
            changed = {}

    book = load_workbook(io.BytesIO(data), data_only=True)
    sheets = []
    budget = limits["maxSheetCells"]

    for worksheet in book.worksheets:
        rows = []
        for row in worksheet.iter_rows(values_only=True):
            if budget <= 0:
                break
            rows.append([("" if cell is None else cell) for cell in row])
            budget -= max(1, len(row))

        width = max((len(row) for row in rows), default=0)
        sheets.append({
            "name": worksheet.title,
            "columns": [get_column_letter(i + 1) for i in range(width)],
            "rows": rows,
            "totalRows": worksheet.max_row,
            "totalCols": worksheet.max_column,
            "changedCells": changed.get(worksheet.title, []),
        })

    return {"kind": "sheet", "sheets": sheets, "isNew": before is None}


def _preview_pdf(path, data, limits):
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(data))
    pages = []
    for page in reader.pages[:20]:
        try:
            pages.append((page.extract_text() or "")[:2000])
        except Exception:
            pages.append("")
    return {"kind": "pdf", "pages": len(reader.pages), "text": pages,
            "encrypted": bool(getattr(reader, "is_encrypted", False))}


def _preview_document(path, data, limits):
    import docx
    document = docx.Document(io.BytesIO(data))
    paragraphs = [
        {"style": p.style.name if p.style else "", "text": p.text}
        for p in document.paragraphs[:200]
    ]
    return {"kind": "document", "paragraphs": paragraphs}


def _preview_archive(path, data, limits):
    import zipfile
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        entries = [
            {"name": i.filename, "size": i.file_size, "dir": i.is_dir()}
            for i in archive.infolist()[:200]
        ]
    return {"kind": "archive", "entries": entries}


def _preview_binary(path, data, limits):
    return {"kind": "binary", "hexHead": data[:64].hex()}


_PREVIEW = {
    "text": _preview_text,
    "table": _preview_table,
    "json": _preview_json,
    "image": _preview_image,
    "sheet": _preview_sheet,
    "pdf": _preview_pdf,
    "document": _preview_document,
    "archive": _preview_archive,
    "binary": _preview_binary,
}


def _build_preview(path, data, limits, before=None):
    """Never let a bad file take the run down with it."""
    kind = _kind_for(path, data)
    try:
        if kind == "sheet":
            return kind, _preview_sheet(path, data, limits, before)
        return kind, _PREVIEW[kind](path, data, limits)
    except Exception as exc:
        fallback = _preview_binary(path, data, limits)
        fallback["note"] = f"could not read this {kind}: {_headline(exc)}"
        return "binary", fallback


# ---------------------------------------------------------------- the diff

def _diff(before, root=WORKSPACE, limits=None, order_start=0):
    limits = {**DEFAULT_LIMITS, **(limits or {})}
    after = _snapshot(root)

    artifacts = []
    skipped = []
    spent = 0
    order = order_start

    changed = []
    for path, finger in sorted(after.items()):
        was = before.get(path)
        if was is None:
            changed.append((path, "created"))
        elif was[2] != finger[2] or was[0] != finger[0]:
            changed.append((path, "modified"))
    for path in sorted(set(before) - set(after)):
        changed.append((path, "deleted"))

    for path, change in changed:
        if len(artifacts) >= limits["maxFiles"]:
            skipped.append({"path": path, "bytes": 0, "reason": "too-many"})
            continue

        if change == "deleted":
            artifacts.append({
                "id": "fs:" + path, "kind": "text", "change": "deleted",
                "title": os.path.basename(path), "path": path, "bytes": before[path][0],
                "truncated": False, "preview": {"kind": "text", "head": "", "lineCount": 0,
                                                "truncated": False}, "order": order,
            })
            order += 1
            continue

        full = os.path.join(root, path)
        size = after[path][0]
        if size > limits["maxBytesPerFile"] or spent + size > limits["maxTotalBytes"]:
            skipped.append({"path": path, "bytes": size, "reason": "too-big"})
            continue

        with open(full, "rb") as handle:
            data = handle.read()
        spent += size

        kind, preview = _build_preview(
            path, data, limits, _BEFORE_BYTES.get(path) if change == "modified" else None
        )
        artifact = {
            "id": "fs:" + path, "kind": kind, "change": change,
            "title": os.path.basename(path), "path": path, "bytes": size,
            "truncated": bool(preview.get("truncated")), "preview": preview,
            "order": order,
        }
        # Only images travel as bytes. Everything else was decoded here, in
        # Python, where the parser already lives.
        if kind == "image":
            blob_id = "blob:" + path
            _BLOBS[blob_id] = data
            artifact["blob"] = {"id": blob_id, "mime": preview.get("mime", "image/png"),
                                "bytes": size, "inline": True}
        artifacts.append(artifact)
        order += 1

    for extra in _EMITTED:
        extra = dict(extra)
        extra["order"] = order
        artifacts.append(extra)
        order += 1

    return {"artifacts": artifacts, "notes": list(_NOTES), "skipped": skipped,
            "workspace": root}


# ---------------------------------------------------------------- helpers

def _api(ns):
    def set_input(values):
        _inputs.items = [str(v) for v in values]

    def get_output():
        return sys.stdout.getvalue()

    def clear_output():
        sys.stdout.seek(0)
        sys.stdout.truncate(0)

    def capture(fn, *args, **kwargs):
        clear_output()
        result = fn(*args, **kwargs)
        return result, sys.stdout.getvalue()

    def script_output():
        return ns.get("_script_output", "")

    def lines_of(text):
        return [ln.rstrip() for ln in text.strip().split("\n") if ln.strip()]

    def require(name, kind="function"):
        if name not in ns:
            raise AssertionError(
                f"I could not find a {kind} named '{name}'. "
                f"Check the spelling and make sure it is defined at the top level."
            )
        return ns[name]

    def stage_emit(kind, title, payload, order=0, path=None):
        """Add a panel the filesystem diff could not have found on its own."""
        _EMITTED.append({
            "id": f"emit:{len(_EMITTED)}:{title}", "kind": kind, "change": "emitted",
            "title": title, "path": path, "bytes": 0, "truncated": False,
            "preview": dict(payload, kind=kind), "order": order,
        })

    def stage_note(text):
        _NOTES.append(str(text))

    def stage_table(rows, columns=None, title="Table"):
        body = [list(map(lambda v: "" if v is None else v, r)) for r in rows]
        stage_emit("table", title, {"columns": list(columns or []), "rows": body,
                                    "totalRows": len(body)})

    def stage_image(image, title="Result"):
        target = os.path.join(WORKSPACE, f"_stage_{len(_EMITTED)}.png")
        image.save(target)
        stage_note(f"{title} saved as {os.path.basename(target)}")

    return dict(
        set_input=set_input, get_output=get_output, clear_output=clear_output,
        capture=capture, script_output=script_output, lines_of=lines_of,
        require=require, stage_emit=stage_emit, stage_note=stage_note,
        stage_table=stage_table, stage_image=stage_image,
    )


def _new_user_module(name="solution", as_main=True):
    """Create the learner's module and hand back its namespace.

    Tests written against the source material patch module-qualified targets —
    @patch('solution.pyautogui.click') — and mock.patch resolves those through
    sys.modules. A module's __dict__ is read-only, so rather than attaching a
    namespace afterwards we exec directly INTO the module's own dict; the two
    are then the same object and anything defined later is visible as an
    attribute.

    __name__ follows real Python. Running a file makes it "__main__"; importing
    it for tests makes it the module name. So a learner who guards their demo
    call with an "if __name__" block gets exactly what they expect: it runs
    when they press Run, and is skipped when they are graded.
    """
    module = types.ModuleType(name)
    ns = module.__dict__
    ns["__name__"] = "__main__" if as_main else name
    ns["__file__"] = USER_FILE
    sys.modules[name] = module
    sys.modules["assignment"] = module
    return module, ns


def _uninstall_user_module(name="solution"):
    sys.modules.pop(name, None)
    sys.modules.pop("assignment", None)


# ---------------------------------------------------------------- test cases

class _BridgeResult(unittest.TestResult):
    """Maps unittest outcomes onto the same rows a test_ function produces."""

    def __init__(self):
        super().__init__()
        self.rows = []

    def _label(self, test):
        doc = test.shortDescription()
        if doc:
            return doc
        name = test.id().rsplit(".", 1)[-1]
        return name[5:].replace("_", " ") if name.startswith("test_") else name

    def addSuccess(self, test):
        self.rows.append({"name": self._label(test), "passed": True,
                          "message": "", "traceback": ""})

    def _failure(self, test, err, prefix=""):
        exc = err[1]
        message = str(exc) or _headline(exc)
        self.rows.append({
            "name": self._label(test), "passed": False,
            "message": prefix + message,
            "traceback": "" if isinstance(exc, AssertionError) else _format_traceback(exc),
        })

    def addFailure(self, test, err):
        self._failure(test, err)

    def addError(self, test, err):
        self._failure(test, err)

    def addSkip(self, test, reason):
        self.rows.append({"name": self._label(test), "passed": True,
                          "message": f"skipped: {reason}", "traceback": ""})

    def addSubTest(self, test, subtest, err):
        if err is None:
            return
        self._failure(subtest, err)


def _run_test_cases(cases):
    rows = []
    for case in cases:
        suite = unittest.TestLoader().loadTestsFromTestCase(case)
        result = _BridgeResult()
        suite.run(result)
        rows.extend(result.rows)
    return rows


# ---------------------------------------------------------------- lifecycle

def __harness_mark_baseline():
    """Remember the clean state, after packages are loaded and before content."""
    _BASELINE["modules"] = set(sys.modules)
    _BASELINE["path"] = list(sys.path)
    return json.dumps({"modules": len(_BASELINE["modules"])})


def __harness_install_stub(name, source):
    """Register a stand-in module under the real library's name."""
    module = types.ModuleType(name)
    module.__file__ = f"<stub:{name}>"
    exec(compile(source, f"<stub:{name}>", "exec"), module.__dict__)
    sys.modules[name] = module
    _STUBS[name] = module
    return name


def __harness_reset(workspace=WORKSPACE):
    """Undo everything a project can do to the interpreter.

    Without this, project N's fake requests module, its sys.path entry and its
    files are all still present for project N+1, and a suite starts passing or
    failing depending on what ran before it.
    """
    for name in list(sys.modules):
        if name not in _BASELINE["modules"] and name not in _STUBS:
            sys.modules.pop(name, None)
    sys.path[:] = list(_BASELINE["path"])
    linecache.clearcache()

    for module in _STUBS.values():
        reset = getattr(module, "reset", None)
        if callable(reset):
            try:
                reset()
            except Exception:
                pass

    # Step out before deleting: you cannot remove the directory you are
    # standing in, and with ignore_errors=True that would fail *silently*,
    # leaving the next project to inherit these files.
    os.chdir("/")
    if os.path.exists(workspace):
        shutil.rmtree(workspace, ignore_errors=True)
    os.makedirs(workspace, exist_ok=True)
    os.chdir(workspace)

    _BLOBS.clear()
    _BEFORE_BYTES.clear()
    _EMITTED.clear()
    _NOTES.clear()
    _inputs.items = []
    return workspace


def __harness_blob_ids():
    return json.dumps(list(_BLOBS))


def __harness_blob(blob_id):
    return _BLOBS.get(blob_id, b"")


def __harness_clear_blobs():
    _BLOBS.clear()


def __harness_capabilities():
    return json.dumps({
        "python": sys.version,
        "workspace": WORKSPACE,
        "stubs": sorted(_STUBS),
        "modules": sorted(m for m in sys.modules if "." not in m)[:400],
    })


# ---------------------------------------------------------------- entry points

def _prepare(spec):
    workspace = spec.get("workspace", WORKSPACE)
    _ensure_workspace(workspace)
    os.chdir(workspace)
    for name, contents in (spec.get("fixtures") or {}).items():
        target = os.path.join(workspace, name)
        folder = os.path.dirname(target)
        if folder:
            os.makedirs(folder, exist_ok=True)
        with open(target, "w") as handle:
            handle.write(contents)
    return workspace


def _install_io(stream=False):
    buffer = _Out()
    buffer.bridge = _STDOUT[0] if stream else None
    saved = (sys.stdout, sys.stderr, builtins.input)
    sys.stdout = buffer
    sys.stderr = buffer
    builtins.input = _inputs.read
    _inputs.items = []
    return buffer, saved


def _restore_io(saved):
    sys.stdout, sys.stderr, builtins.input = saved


def __harness_run(user_code, spec_json):
    """Grade the learner's code. Returns a JSON report."""
    spec = json.loads(spec_json)
    workspace = _prepare(spec)
    limits = spec.get("limits") or {}
    buffer, saved = _install_io()
    _inputs.interactive = False
    _inputs.grading = True

    module_name = spec.get("moduleName", "solution")
    module, ns = _new_user_module(module_name, as_main=False)
    report = {"ok": False, "stdout": "", "tests": [], "fatal": None, "stage": None}

    try:
        if (spec.get("setup") or "").strip():
            try:
                exec(compile(spec["setup"], "<setup>", "exec"), ns)
            except Exception as exc:
                report["fatal"] = {"headline": "The project setup failed to load.",
                                   "traceback": _format_traceback(exc, keep_hidden=True)}
                return json.dumps(report)

        ns.update(_api(ns))

        # Snapshot AFTER setup: fixtures the project provided are the baseline,
        # not a change the learner made.
        before = _snapshot(workspace, keep_bytes=True)

        _register_source(USER_FILE, user_code)
        try:
            exec(compile(user_code, USER_FILE, "exec"), ns)
        except BaseException as exc:
            report["stdout"] = buffer.getvalue()
            report["fatal"] = {"headline": _headline(exc), "traceback": _format_traceback(exc)}
            report["stage"] = _diff(before, workspace, limits)
            return json.dumps(report)

        setup_output = buffer.getvalue()
        ns["_script_output"] = setup_output

        known = set(ns)
        try:
            exec(compile(spec.get("tests", ""), "<tests>", "exec"), ns)
        except Exception as exc:
            report["fatal"] = {"headline": "The hidden test suite failed to load.",
                               "traceback": _format_traceback(exc, keep_hidden=True)}
            return json.dumps(report)

        plain = [k for k in ns if k.startswith("test_") and k not in known and callable(ns[k])]
        cases = [
            v for k, v in ns.items()
            if k not in known and isinstance(v, type)
            and issubclass(v, unittest.TestCase) and v is not unittest.TestCase
        ]

        for name in plain:
            fn = ns[name]
            label = (fn.__doc__ or name[5:].replace("_", " ")).strip()
            row = {"name": label, "passed": False, "message": "", "traceback": ""}
            buffer.seek(0)
            buffer.truncate(0)
            _inputs.items = []
            random.seed(spec.get("seed", 1234))
            try:
                fn()
                row["passed"] = True
            except AssertionError as exc:
                row["message"] = str(exc) or "The assertion did not hold."
            except BaseException as exc:
                row["message"] = _headline(exc)
                row["traceback"] = _format_traceback(exc)
            report["tests"].append(row)

        if cases:
            random.seed(spec.get("seed", 1234))
            report["tests"].extend(_run_test_cases(cases))

        report["stdout"] = setup_output
        report["ok"] = bool(report["tests"]) and all(t["passed"] for t in report["tests"])
        report["stage"] = _diff(before, workspace, limits)
        return json.dumps(report)
    finally:
        _restore_io(saved)
        _uninstall_user_module(module_name)


def __harness_script(user_code, spec_json):
    """Just run it and show what happened. No grading."""
    spec = json.loads(spec_json)
    workspace = _prepare(spec)
    limits = spec.get("limits") or {}
    buffer, saved = _install_io(stream=True)
    _inputs.items = [str(v) for v in (spec.get("stdin") or [])]
    # A script may pause for a human. A graded run never may.
    _inputs.interactive = bool(spec.get("interactive"))
    _inputs.grading = False

    module_name = spec.get("moduleName", "solution")
    module, ns = _new_user_module(module_name)
    out = {"stdout": "", "fatal": None, "stage": None}
    try:
        if (spec.get("setup") or "").strip():
            exec(compile(spec["setup"], "<setup>", "exec"), ns)
        ns.update(_api(ns))

        before = _snapshot(workspace, keep_bytes=True)
        _register_source(USER_FILE, user_code)
        random.seed(spec.get("seed", 1234))
        try:
            exec(compile(user_code, USER_FILE, "exec"), ns)
        except BaseException as exc:
            out["fatal"] = {"headline": _headline(exc), "traceback": _format_traceback(exc)}
        out["stdout"] = buffer.getvalue()
        out["stage"] = _diff(before, workspace, limits)
        return json.dumps(out)
    finally:
        _restore_io(saved)
        _uninstall_user_module(module_name)
`;
