import os

SCRATCH = "/tmp/day15"


def _path(name):
    os.makedirs(SCRATCH, exist_ok=True)
    path = os.path.join(SCRATCH, name)
    if os.path.exists(path):
        os.remove(path)
    return path


def test_add_score_sorts():
    """add_score keeps the table in descending order"""
    add_score = require("add_score")
    save_scores = require("save_scores")
    path = _path("add.txt")
    save_scores(path, [("Kira", 900), ("Bo", 750)])
    result = add_score(path, "Ana", 800)
    assert result == [("Kira", 900), ("Ana", 800), ("Bo", 750)], f"Got {result}"


def test_add_score_keeps_five_and_persists():
    """Only the top five survive, and they survive on disk"""
    add_score = require("add_score")
    load_scores = require("load_scores")
    save_scores = require("save_scores")
    path = _path("top5.txt")
    save_scores(path, [("A", 10), ("B", 20), ("C", 30), ("D", 40), ("E", 50)])
    result = add_score(path, "F", 45)
    assert len(result) == 5, f"Expected five entries, got {len(result)}: {result}"
    assert ("A", 10) not in result, f"The lowest score should have dropped off. Got {result}"
    assert load_scores(path) == result, (
        "The file on disk does not match what add_score returned — did you save it?"
    )
