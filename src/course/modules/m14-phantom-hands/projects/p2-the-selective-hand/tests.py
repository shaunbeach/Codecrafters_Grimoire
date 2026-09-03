import os

SOURCE = "/workspace/expedition"
DEST = "/workspace/photos"


def test_reaches_through_the_tree():
    """Files three folders down are still found"""
    gather = require("gather")
    reset_expedition()
    result = gather(SOURCE, DEST, "jpg")
    assert result == ["SUMMIT.JPG", "camp.jpg", "ridge.jpg"], (
        f"Got {result}. os.walk descends the whole tree for you."
    )


def test_files_actually_arrive():
    """The copies are really in the destination"""
    gather = require("gather")
    reset_expedition()
    gather(SOURCE, DEST, "jpg")
    assert sorted(os.listdir(DEST)) == ["SUMMIT.JPG", "camp.jpg", "ridge.jpg"], (
        f"The destination holds {sorted(os.listdir(DEST))}"
    )


def test_originals_are_left_alone():
    """This is a copy, not a move"""
    gather = require("gather")
    reset_expedition()
    gather(SOURCE, DEST, "jpg")
    assert os.path.exists(os.path.join(SOURCE, "camp.jpg")), (
        "camp.jpg is gone from the expedition folder. shutil.copy, not shutil.move — "
        "a gathering script that is wrong should not also be destructive."
    )


def test_case_insensitive():
    """SUMMIT.JPG is a jpg"""
    gather = require("gather")
    reset_expedition()
    assert "SUMMIT.JPG" in gather(SOURCE, DEST, "jpg"), (
        "Lower-case both sides before comparing the extension."
    )


def test_other_extensions_left():
    """Only what was asked for is taken"""
    gather = require("gather")
    reset_expedition()
    gather(SOURCE, DEST, "jpg")
    assert "roster.txt" not in os.listdir(DEST) and "map.png" not in os.listdir(DEST), (
        f"The destination holds {sorted(os.listdir(DEST))}"
    )


def test_creates_the_destination():
    """A destination that does not exist yet is made"""
    gather = require("gather")
    reset_expedition()
    fresh = "/workspace/brand-new"
    result = gather(SOURCE, fresh, "png")
    assert os.path.isdir(fresh), "os.makedirs(destination, exist_ok=True)."
    assert result == ["map.png"], f"Got {result}"
