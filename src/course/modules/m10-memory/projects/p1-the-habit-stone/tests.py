import os

SCRATCH = "/tmp/day20"


def _path(name):
    os.makedirs(SCRATCH, exist_ok=True)
    path = os.path.join(SCRATCH, name)
    if os.path.exists(path):
        os.remove(path)
    return path


def test_load_missing_file():
    """A tracker with no history yet starts empty"""
    load_habits = require("load_habits")
    path = os.path.join(SCRATCH, "never-written.txt")
    if os.path.exists(path):
        os.remove(path)
    try:
        result = load_habits(path)
    except FileNotFoundError:
        raise AssertionError(
            "load_habits raised FileNotFoundError. The very first run has no "
            "file — return {} instead."
        )
    assert result == {}, f"Expected an empty dict, got {result!r}"


def test_load_parses_counts():
    """Counts come back as ints"""
    load_habits = require("load_habits")
    path = _path("read.txt")
    with open(path, "w") as handle:
        handle.write("reading:12\nexercise:5\n")
    habits = load_habits(path)
    assert habits == {"reading": 12, "exercise": 5}, f"Got {habits!r}"
    assert isinstance(habits["reading"], int), (
        f"The count came back as {type(habits['reading']).__name__}; convert it with int()."
    )


def test_load_skips_junk():
    """Damaged lines are ignored, not fatal"""
    load_habits = require("load_habits")
    path = _path("junk.txt")
    with open(path, "w") as handle:
        handle.write("reading:12\n\nnonsense\nexercise:lots\n   \nart:3\n")
    try:
        habits = load_habits(path)
    except Exception as exc:
        raise AssertionError(
            f"A malformed line crashed load_habits with {type(exc).__name__}: {exc}. "
            "Skip lines you cannot parse."
        )
    assert habits == {"reading": 12, "art": 3}, f"Got {habits!r}"


def test_save_is_sorted():
    """Saving writes sorted, deterministic lines"""
    save_habits = require("save_habits")
    path = _path("save.txt")
    save_habits(path, {"reading": 12, "art": 3, "exercise": 5})
    with open(path) as handle:
        text = handle.read()
    assert text == "art:3\nexercise:5\nreading:12\n", (
        f"Expected sorted 'name:count' lines, got {text!r}"
    )


def test_round_trip():
    """Save then load returns exactly what you started with"""
    save_habits = require("save_habits")
    load_habits = require("load_habits")
    path = _path("round.txt")
    habits = {"reading": 12, "exercise": 5, "art": 0}
    save_habits(path, habits)
    assert load_habits(path) == habits, f"Got {load_habits(path)!r} back from disk."
