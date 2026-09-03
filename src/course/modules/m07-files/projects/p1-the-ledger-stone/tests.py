import os

SCRATCH = "/tmp/day15"


def _path(name):
    os.makedirs(SCRATCH, exist_ok=True)
    path = os.path.join(SCRATCH, name)
    if os.path.exists(path):
        os.remove(path)
    return path


def test_save_writes_lines():
    """save_scores writes one name,points per line"""
    save_scores = require("save_scores")
    path = _path("basic.txt")
    save_scores(path, [("Kira", 900), ("Bo", 750)])
    assert os.path.exists(path), "No file appeared at the path you were given."
    with open(path) as handle:
        text = handle.read()
    assert text == "Kira,900\nBo,750\n", (
        f"Expected 'Kira,900\\nBo,750\\n' but the file holds {text!r}. "
        "Remember write() does not add the newline for you."
    )


def test_load_round_trip():
    """What you save is what you load"""
    save_scores = require("save_scores")
    load_scores = require("load_scores")
    path = _path("round.txt")
    scores = [("Kira", 900), ("Bo", 750), ("Ana", 800)]
    save_scores(path, scores)
    assert load_scores(path) == scores, f"Got {load_scores(path)}"


def test_points_are_ints():
    """Loaded points are numbers, not strings"""
    load_scores = require("load_scores")
    path = _path("ints.txt")
    with open(path, "w") as handle:
        handle.write("Kira,900\n")
    loaded = load_scores(path)
    assert loaded == [("Kira", 900)], f"Got {loaded}"
    assert isinstance(loaded[0][1], int), (
        f"The points came back as {type(loaded[0][1]).__name__}. "
        "Everything read from a file is text — convert it with int()."
    )


def test_missing_file():
    """Loading a file that does not exist gives an empty list"""
    load_scores = require("load_scores")
    path = os.path.join(SCRATCH, "definitely-not-here.txt")
    if os.path.exists(path):
        os.remove(path)
    try:
        result = load_scores(path)
    except FileNotFoundError:
        raise AssertionError(
            "load_scores crashed with FileNotFoundError. The first time a "
            "program runs, its save file will not exist yet — handle that."
        )
    assert result == [], f"Expected [], got {result}"


def test_empty_file():
    """An empty save file loads as an empty list"""
    load_scores = require("load_scores")
    path = _path("empty.txt")
    open(path, "w").close()
    assert load_scores(path) == [], f"Got {load_scores(path)}"


def test_save_overwrites():
    """Saving replaces the old contents rather than appending"""
    save_scores = require("save_scores")
    load_scores = require("load_scores")
    path = _path("over.txt")
    save_scores(path, [("Kira", 900), ("Bo", 750)])
    save_scores(path, [("Ana", 100)])
    assert load_scores(path) == [("Ana", 100)], (
        f"Got {load_scores(path)}. Open with mode 'w', not 'a'."
    )
