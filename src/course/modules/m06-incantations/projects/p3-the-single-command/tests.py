def test_set_and_get():
    """set stores a number, get reads it back"""
    run_command = require("run_command")
    store = {}
    assert run_command(store, "set gold 50") == "gold = 50", f"Got {run_command({}, 'set gold 50')!r}"
    assert store == {"gold": 50}, f"The store holds {store}; the value should be the int 50."
    assert run_command(store, "get gold") == "gold = 50"


def test_add_accumulates():
    """add starts from zero for a new key and accumulates after that"""
    run_command = require("run_command")
    store = {}
    assert run_command(store, "add gold 20") == "gold = 20"
    assert run_command(store, "add gold 50") == "gold = 70", (
        f"Adding 50 to 20 should report 'gold = 70', got {run_command(store, 'add gold 50')!r}"
    )


def test_delete():
    """del removes a key and reports on a missing one"""
    run_command = require("run_command")
    store = {"gold": 5}
    assert run_command(store, "del gold") == "deleted gold"
    assert store == {}, f"The key should be gone; the store holds {store}"
    assert run_command(store, "del gold") == "no such key: gold"
    assert run_command(store, "get rope") == "no such key: rope"


def test_list():
    """list shows sorted keys, or (empty)"""
    run_command = require("run_command")
    assert run_command({}, "list") == "(empty)", f"Got {run_command({}, 'list')!r}"
    assert run_command({"rope": 1, "gold": 5}, "list") == "gold, rope", (
        "Keys should be sorted and joined with a comma and a space."
    )


def test_unknown_command():
    """An unrecognised verb is named in the response"""
    run_command = require("run_command")
    assert run_command({}, "frobnicate gold") == "unknown command: frobnicate", (
        f"Got {run_command({}, 'frobnicate gold')!r}"
    )


def test_bad_arguments():
    """Malformed commands never crash"""
    run_command = require("run_command")
    for line in ["", "   ", "set", "set gold", "set gold fifty", "set gold 1 2", "get", "get a b"]:
        try:
            result = run_command({}, line)
        except Exception as exc:
            raise AssertionError(
                f"run_command(store, {line!r}) raised {type(exc).__name__}: {exc}. "
                "Check the argument count and the value before using them."
            )
        assert result == "bad arguments", (
            f"run_command(store, {line!r}) should return 'bad arguments', got {result!r}"
        )


def test_whitespace_is_tolerated():
    """Extra spaces between words are fine"""
    run_command = require("run_command")
    store = {}
    assert run_command(store, "  set   gold    50  ") == "gold = 50", (
        "Use .split() with no arguments — it collapses runs of whitespace for you."
    )
