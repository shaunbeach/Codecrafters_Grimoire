// Phase 1 acceptance: proves the runtime engine can run a script, report what
// it did to the filesystem, load vendored packages, bridge unittest, serve the
// stand-in modules, and leave nothing behind between projects.
import { bootRuntime } from './lib/runtime.mjs'

let failures = 0
const results = []

function check(name, condition, detail = '') {
  results.push({ name, ok: Boolean(condition), detail })
  if (!condition) failures++
}

function section(title) {
  results.push({ section: title })
}

const rt = await bootRuntime()

// ---------------------------------------------------------------- workspace

section('Workspace and filesystem diff')
rt.reset()

let report = rt.runScript(
  `
import os, json, csv
with open("notes.txt", "w") as f:
    f.write("line one\\nline two\\n")
os.makedirs("reports", exist_ok=True)
with open("reports/sales.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["region", "sales"])
    w.writerow(["North", 4200])
    w.writerow(["South", 3100])
with open("config.json", "w") as f:
    json.dump({"theme": "dark", "retries": 3}, f)
print("wrote three files")
`,
  { workspace: '/workspace' },
)

const byPath = Object.fromEntries((report.stage?.artifacts ?? []).map((a) => [a.path, a]))
check('script runs without error', report.fatal === null, report.fatal?.headline ?? '')
check('stdout captured', report.stdout.trim() === 'wrote three files', report.stdout.trim())
check('three files detected', report.stage.artifacts.length === 3, `saw ${report.stage.artifacts.length}`)
check('all marked created', report.stage.artifacts.every((a) => a.change === 'created'))
check('text preview decoded', byPath['notes.txt']?.preview.head.includes('line one'))
check(
  'csv parsed to a table',
  byPath['reports/sales.csv']?.preview.columns?.join(',') === 'region,sales' &&
    byPath['reports/sales.csv']?.preview.rows.length === 2,
  JSON.stringify(byPath['reports/sales.csv']?.preview).slice(0, 90),
)
check(
  'json parsed to a value',
  byPath['config.json']?.preview.value?.retries === 3,
  JSON.stringify(byPath['config.json']?.preview.value),
)
check('nested path preserved', 'reports/sales.csv' in byPath, Object.keys(byPath).join(' '))

// modified vs created
section('Change classification')
rt.reset()
report = rt.runScript(
  `
with open("keep.txt", "w") as f: f.write("original")
with open("gone.txt", "w") as f: f.write("bye")
`,
  { workspace: '/workspace' },
)
const second = rt.runScript(
  `
import os
with open("keep.txt", "w") as f: f.write("changed!")
os.remove("gone.txt")
with open("fresh.txt", "w") as f: f.write("new")
`,
  { workspace: '/workspace' },
)
const changes = Object.fromEntries(second.stage.artifacts.map((a) => [a.path, a.change]))
check('modified detected', changes['keep.txt'] === 'modified', JSON.stringify(changes))
check('deleted detected', changes['gone.txt'] === 'deleted', JSON.stringify(changes))
check('created detected', changes['fresh.txt'] === 'created', JSON.stringify(changes))

// ---------------------------------------------------------------- images

section('Images (in-lock wheel + byte transport)')
rt.reset()
await rt.load(['pillow'])
report = rt.runScript(
  `
from PIL import Image, ImageDraw
img = Image.new("RGB", (120, 60), "navy")
ImageDraw.Draw(img).ellipse((10, 10, 50, 50), fill="gold")
img.save("badge.png")
`,
  { workspace: '/workspace' },
)
const badge = report.stage.artifacts.find((a) => a.path === 'badge.png')
check('png recognised as an image', badge?.kind === 'image', badge?.kind)
check('dimensions read', badge?.preview.width === 120 && badge?.preview.height === 60,
  `${badge?.preview.width}x${badge?.preview.height}`)
check('blob offered for transport', badge?.blob?.mime === 'image/png')
const blobs = rt.blobs()
const bytes = blobs[badge?.blob?.id]
check('blob bytes are a real PNG', bytes && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47,
  bytes ? `${bytes.length} bytes` : 'no bytes')

// ---------------------------------------------------------------- wheels

section('Vendored wheels')
rt.reset()
await rt.load(['openpyxl', 'pypdf', 'python-docx'])

report = rt.runScript(
  `
from openpyxl import Workbook
wb = Workbook(); ws = wb.active; ws.title = "Q1"
ws.append(["Region", "Sales"]); ws.append(["North", 4200]); ws.append(["South", 3100])
wb.save("sales.xlsx")

from pypdf import PdfWriter
w = PdfWriter()
for i in range(3):
    w.add_blank_page(width=200 + i * 10, height=200)
with open("report.pdf", "wb") as f:
    w.write(f)

import docx
d = docx.Document()
d.add_heading("Quarterly Review", 0)
d.add_paragraph("Sales rose in the North.")
d.save("review.docx")
`,
  { workspace: '/workspace' },
)
const made = Object.fromEntries(report.stage.artifacts.map((a) => [a.path, a]))
check('openpyxl wheel loaded and saved', report.fatal === null, report.fatal?.traceback ?? '')
check('xlsx decoded to a grid',
  made['sales.xlsx']?.preview.sheets?.[0]?.rows?.[1]?.[1] === 4200,
  JSON.stringify(made['sales.xlsx']?.preview.sheets?.[0]?.rows))
check('sheet name preserved', made['sales.xlsx']?.preview.sheets?.[0]?.name === 'Q1')
check('pdf page count read', made['report.pdf']?.preview.pages === 3, String(made['report.pdf']?.preview.pages))
check('docx paragraphs read',
  made['review.docx']?.preview.paragraphs?.some((p) => p.text === 'Quarterly Review'),
  JSON.stringify(made['review.docx']?.preview.paragraphs?.slice(0, 2)))
check('no raw bytes shipped for xlsx/pdf/docx',
  !made['sales.xlsx']?.blob && !made['report.pdf']?.blob && !made['review.docx']?.blob)

// ---------------------------------------------------------------- unittest

section('unittest bridge')
rt.reset()
report = rt.runTests(
  `
def double(n):
    return n * 2
`,
  {
    workspace: '/workspace',
    tests: `
import unittest
from solution import double

class TestDouble(unittest.TestCase):
    def test_positive(self):
        """doubles a positive number"""
        self.assertEqual(double(4), 8)

    def test_negative(self):
        """doubles a negative number"""
        self.assertEqual(double(-3), -6)

    def test_deliberate_failure(self):
        """this one is meant to fail"""
        self.assertEqual(double(1), 99)
`,
  },
)
check('TestCase collected', report.tests.length === 3, `collected ${report.tests.length}`)
check('docstrings used as labels',
  report.tests.some((t) => t.name === 'doubles a positive number'),
  report.tests.map((t) => t.name).join(' | '))
check('passes recorded', report.tests.filter((t) => t.passed).length === 2)
check('failure carries unittest message',
  report.tests.find((t) => !t.passed)?.message.includes('99'),
  report.tests.find((t) => !t.passed)?.message)
check('overall not ok when one fails', report.ok === false)
check('`from solution import` works', report.fatal === null, report.fatal?.headline ?? '')

// mixing both conventions
report = rt.runTests(`def triple(n): return n * 3`, {
  workspace: '/workspace',
  tests: `
import unittest

def test_plain_style():
    """plain function style still works"""
    assert triple(2) == 6, "expected 6"

class TestTriple(unittest.TestCase):
    def test_case_style(self):
        """TestCase style works alongside it"""
        self.assertEqual(triple(3), 9)
`,
})
check('both conventions run together', report.tests.length === 2 && report.ok === true,
  JSON.stringify(report.tests.map((t) => [t.name, t.passed])))

// ---------------------------------------------------------------- stubs

section('Stand-in modules')
rt.reset()
await rt.load(['pyautogui', 'pyperclip'])
report = rt.runTests(
  `
import pyautogui

def find_and_click(image):
    spot = pyautogui.locateCenterOnScreen(image)
    if spot is None:
        raise ValueError("Image not found on screen")
    pyautogui.click(spot)
    return spot
`,
  {
    workspace: '/workspace',
    tests: `
import unittest
from unittest.mock import patch
from solution import find_and_click

class TestClick(unittest.TestCase):
    @patch('solution.pyautogui.click')
    @patch('solution.pyautogui.locateCenterOnScreen')
    def test_found(self, mock_locate, mock_click):
        """module-qualified patching resolves"""
        mock_locate.return_value = (500, 400)
        self.assertEqual(find_and_click("submit.png"), (500, 400))
        mock_click.assert_called_once_with((500, 400))

    @patch('solution.pyautogui.locateCenterOnScreen')
    def test_missing(self, mock_locate):
        """raises when the image is absent"""
        mock_locate.return_value = None
        with self.assertRaisesRegex(ValueError, "Image not found on screen"):
            find_and_click("nope.png")
`,
  },
)
check('pyautogui stub imports', report.fatal === null, report.fatal?.headline ?? '')
check("@patch('solution.pyautogui.click') resolves", report.ok === true,
  report.tests.map((t) => `${t.name}: ${t.message}`).join(' | '))

// the stub without mocks — recording real events
report = rt.runScript(
  `
import pyautogui
pyautogui.SCREEN_FIXTURES["ok.png"] = (300, 200)
pyautogui.moveTo(10, 10)
pyautogui.click(pyautogui.locateCenterOnScreen("ok.png"))
pyautogui.write("hello")
print(len(pyautogui.EVENTS), "events")
print(pyautogui.EVENTS[-1]["action"])
`,
  { workspace: '/workspace' },
)
check('stub records events', report.stdout.includes('4 events'), report.stdout.trim())
check('stub logs the last action', report.stdout.includes('write'), report.stdout.trim())

report = rt.runScript(
  `
import pyperclip
pyperclip.copy("spam")
print(pyperclip.paste())
`,
  { workspace: '/workspace' },
)
check('pyperclip stub round-trips', report.stdout.trim() === 'spam', report.stdout.trim())

// ---------------------------------------------------------------- isolation

section('Isolation between projects')
rt.reset()
rt.runScript(
  `
import sys, types, os
fake = types.ModuleType("requests")
fake.get = lambda *a, **k: "poisoned"
sys.modules["requests"] = fake
with open("leftover.txt", "w") as f: f.write("should not survive")
sys.path.insert(0, "/workspace")
with open("sneaky.py", "w") as f: f.write("VALUE = 'leaked'")
`,
  { workspace: '/workspace' },
)

rt.reset()
report = rt.runScript(
  `
import os, sys
print("workspace empty:", os.listdir("."))
try:
    import sneaky
    print("LEAKED", sneaky.VALUE)
except ImportError:
    print("sneaky module gone")

# The previous project faked this. It must be gone — and since the real wheel
# was never loaded here, a clean interpreter can only fail to import it.
try:
    import requests
    print("STILL FAKE:", requests.get())
except ImportError:
    print("faked requests evicted")
`,
  { workspace: '/workspace' },
)
check('workspace cleared between projects', report.stdout.includes('workspace empty: []'), report.stdout.trim())
check('sys.path entry removed', report.stdout.includes('sneaky module gone'), report.stdout.trim())
check('faked module evicted', report.stdout.includes('faked requests evicted'), report.stdout.trim())
check('stubs survive reset (they are infrastructure)',
  JSON.parse(rt.py.runPython('__harness_capabilities()')).stubs.includes('pyautogui'))

// ---------------------------------------------------------------- errors

section('Error reporting')
rt.reset()
report = rt.runScript(`def broken(\nprint("never")`, { workspace: '/workspace' })
check('syntax error caught', report.fatal?.headline.startsWith('SyntaxError'), report.fatal?.headline)

report = rt.runScript(`values = [1, 2, 3]\nprint(values[9])`, { workspace: '/workspace' })
check('runtime error caught', report.fatal?.headline.includes('IndexError'), report.fatal?.headline)
check('traceback names solution.py', report.fatal?.traceback.includes('solution.py'),
  report.fatal?.traceback)
check('traceback shows the real line', report.fatal?.traceback.includes('values[9]'),
  report.fatal?.traceback)
check('harness frames hidden',
  !report.fatal?.traceback.includes('__harness') && !report.fatal?.traceback.includes('<exec>'),
  report.fatal?.traceback)

report = rt.runScript(`with open("half.txt","w") as f: f.write("saved")\nraise SystemError("boom")`,
  { workspace: '/workspace' })
check('diff still reported after a crash',
  report.stage?.artifacts.some((a) => a.path === 'half.txt'),
  JSON.stringify(report.stage?.artifacts.map((a) => a.path)))

// ---------------------------------------------------------------- limits

section('Limits')
rt.reset()
report = rt.runScript(
  `
with open("big.bin", "wb") as f:
    f.write(b"x" * (3 * 1024 * 1024))
with open("small.txt", "w") as f:
    f.write("fine")
`,
  { workspace: '/workspace' },
)
check('oversized file skipped, not transferred',
  report.stage.skipped.some((s) => s.path === 'big.bin' && s.reason === 'too-big'),
  JSON.stringify(report.stage.skipped))
check('other files still reported',
  report.stage.artifacts.some((a) => a.path === 'small.txt'))

// ---------------------------------------------------------------- report

const width = Math.max(...results.filter((r) => r.name).map((r) => r.name.length))
for (const row of results) {
  if (row.section) {
    console.log(`\n${row.section}`)
    console.log('-'.repeat(row.section.length))
    continue
  }
  const mark = row.ok ? '✓' : '✗'
  const detail = row.ok ? '' : `  → ${String(row.detail).replace(/\n/g, ' ').slice(0, 120)}`
  console.log(`  ${mark} ${row.name.padEnd(width)}${detail}`)
}

const total = results.filter((r) => r.name).length
console.log(
  failures
    ? `\n${failures} of ${total} checks failed.`
    : `\nAll ${total} runtime checks passed.`,
)
process.exit(failures ? 1 : 0)
