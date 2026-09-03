import os
import zipfile

FOLDER = "/workspace/expedition"
ARCHIVE = "/workspace/expedition.zip"


def _names():
    with zipfile.ZipFile(ARCHIVE) as archive:
        return sorted(archive.namelist())


def test_returns_the_count():
    """Every file beneath the folder is written"""
    seal = require("seal")
    reset_expedition()
    assert seal(FOLDER, ARCHIVE) == 6, f"Got {seal(FOLDER, ARCHIVE)!r} — there are 6 files."


def test_archive_exists():
    """A real zip appears"""
    seal = require("seal")
    reset_expedition()
    seal(FOLDER, ARCHIVE)
    assert os.path.exists(ARCHIVE), "No archive was written."
    assert zipfile.is_zipfile(ARCHIVE), "The file is not a valid zip."


def test_names_are_relative():
    """No trace of where the folder happened to live"""
    seal = require("seal")
    reset_expedition()
    seal(FOLDER, ARCHIVE)
    names = _names()
    assert "camp.jpg" in names, f"The archive holds {names}"
    for name in names:
        assert not name.startswith("/") and "workspace" not in name, (
            f"The archive holds {name!r}. Pass arcname=os.path.relpath(full, folder) "
            "or you store the whole path from the root of the disk."
        )


def test_structure_is_kept():
    """Subfolders survive the journey"""
    seal = require("seal")
    reset_expedition()
    seal(FOLDER, ARCHIVE)
    names = _names()
    assert "day2/ridge.jpg" in names, f"The archive holds {names}"
    assert "day3/peak/SUMMIT.JPG" in names, f"The archive holds {names}"


def test_contents_survive():
    """What comes out is what went in"""
    seal = require("seal")
    reset_expedition()
    seal(FOLDER, ARCHIVE)
    with zipfile.ZipFile(ARCHIVE) as archive:
        assert archive.read("day2/notes.md").decode() == "notes.md"
