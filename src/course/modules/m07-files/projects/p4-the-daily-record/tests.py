import os

DIARY = "/workspace/diary.txt"


def _reset():
    if os.path.exists(DIARY):
        os.remove(DIARY)


def test_creates_the_file():
    """The first entry makes the record"""
    record = require("record")
    _reset()
    assert record(DIARY, "found a door") == 1, f"Got {record(DIARY, 'found a door')!r}"
    with open(DIARY) as handle:
        assert handle.read() == "- found a door\n", "Each line is '- ' then the entry."


def test_appends_rather_than_overwrites():
    """The second entry does not erase the first"""
    record = require("record")
    _reset()
    record(DIARY, "first")
    record(DIARY, "second")
    with open(DIARY) as handle:
        text = handle.read()
    assert text == "- first\n- second\n", (
        f"The file holds {text!r}. Mode 'w' empties the file when it opens; "
        "mode 'a' adds to the end."
    )


def test_returns_the_running_total():
    """Each call reports how many entries there now are"""
    record = require("record")
    _reset()
    assert record(DIARY, "one") == 1
    assert record(DIARY, "two") == 2
    assert record(DIARY, "three") == 3, "The count is of the whole file, not this call."


def test_existing_content_is_kept():
    """A record written before your working ran survives it"""
    record = require("record")
    _reset()
    with open(DIARY, "w") as handle:
        handle.write("- eleven years of notes\n")
    record(DIARY, "and one more")
    with open(DIARY) as handle:
        text = handle.read()
    assert "eleven years of notes" in text, (
        "The earlier entry is gone. This is the mistake that cost the apprentice "
        "eleven years — check your open mode."
    )


def test_blank_entries_refused():
    """Nothing to say means nothing written"""
    record = require("record")
    _reset()
    record(DIARY, "a real entry")
    assert record(DIARY, "   ") == 1, f"Got {record(DIARY, '   ')!r}"
    with open(DIARY) as handle:
        assert handle.read() == "- a real entry\n", "A blank entry should write nothing."


def test_blank_entry_on_a_missing_file():
    """Refusing to write to a file that does not exist is not an error"""
    record = require("record")
    _reset()
    try:
        assert record(DIARY, "") == 0
    except FileNotFoundError:
        raise AssertionError(
            "record raised FileNotFoundError when refusing a blank entry on a file "
            "that does not exist yet."
        )
