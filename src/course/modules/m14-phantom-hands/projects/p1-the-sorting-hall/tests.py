import os

WORKSPACE = "/workspace/downloads"


def test_report_shape():
    """organise reports what it moved"""
    organise = require("organise")
    reset_workspace()
    result = organise(WORKSPACE)
    assert isinstance(result, dict), f"Expected a dict, got {type(result).__name__}."
    assert set(result) == {"images", "documents", "other"}, (
        f"Expected the keys images/documents/other, got {sorted(result)}"
    )


def test_files_are_sorted_correctly():
    """Each file lands in the right category"""
    organise = require("organise")
    reset_workspace()
    result = organise(WORKSPACE)
    assert result["images"] == ["cat.JPG", "diagram.gif", "holiday.jpg", "logo.png"], (
        f"images: {result['images']}"
    )
    assert result["documents"] == ["README.md", "budget.csv", "notes.txt", "report.pdf"], (
        f"documents: {result['documents']}"
    )
    assert result["other"] == ["LICENSE", "archive.zip", "script.py"], (
        f"other: {result['other']} — anything unrecognised, including files with "
        "no extension at all, belongs here."
    )


def test_files_really_moved():
    """The files are on disk in their new homes"""
    organise = require("organise")
    reset_workspace()
    organise(WORKSPACE)
    assert os.path.isfile(os.path.join(WORKSPACE, "images", "holiday.jpg")), (
        "holiday.jpg is not in /workspace/downloads/images."
    )
    assert not os.path.exists(os.path.join(WORKSPACE, "holiday.jpg")), (
        "holiday.jpg is still loose in /workspace/downloads — it was copied, not moved."
    )
    assert os.path.isfile(os.path.join(WORKSPACE, "documents", "notes.txt"))
    assert os.path.isfile(os.path.join(WORKSPACE, "other", "script.py"))


def test_case_insensitive():
    """cat.JPG counts as an image"""
    organise = require("organise")
    reset_workspace()
    organise(WORKSPACE)
    assert os.path.isfile(os.path.join(WORKSPACE, "images", "cat.JPG")), (
        "cat.JPG was not treated as an image. Lower-case the extension before "
        "you compare it."
    )


def test_existing_folders_untouched():
    """Subfolders and their contents are left alone"""
    organise = require("organise")
    reset_workspace()
    organise(WORKSPACE)
    buried = os.path.join(WORKSPACE, "keep_me", "buried.txt")
    assert os.path.isfile(buried), (
        "keep_me/buried.txt is gone. Skip anything that is not a file — "
        "os.path.isfile is the check."
    )
    with open(buried) as handle:
        assert handle.read().strip() == "do not touch me"


def test_running_twice_is_safe():
    """A second run finds nothing to do and does not crash"""
    organise = require("organise")
    reset_workspace()
    organise(WORKSPACE)
    try:
        second = organise(WORKSPACE)
    except Exception as exc:
        raise AssertionError(
            f"The second run raised {type(exc).__name__}: {exc}. Use "
            "os.makedirs(..., exist_ok=True) and skip folders."
        )
    assert second == {"images": [], "documents": [], "other": []}, (
        f"Nothing should be left to move, but the second run reported {second}"
    )
