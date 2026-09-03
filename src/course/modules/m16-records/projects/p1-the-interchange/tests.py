import json
import os

SAVE = "/workspace/save.json"
STATE = {"room": "clearing", "inventory": ["rope"], "moves": 3}


def _write(text):
    with open(SAVE, "w") as handle:
        handle.write(text)


def test_round_trip():
    """What you save is what you load"""
    save_state, load_state = require("save_state"), require("load_state")
    save_state(SAVE, STATE)
    assert load_state(SAVE) == STATE, f"Got {load_state(SAVE)}"


def test_written_as_readable_json():
    """The file is indented and sorted"""
    save_state = require("save_state")
    save_state(SAVE, STATE)
    with open(SAVE) as handle:
        text = handle.read()
    assert "\n" in text and "  " in text, (
        f"The file is {text!r}. indent=2 is what makes it reviewable."
    )
    assert text.index('"inventory"') < text.index('"moves"') < text.index('"room"'), (
        "The keys are not sorted. sort_keys=True makes the same state produce the "
        "same bytes every time."
    )


def test_missing_file():
    """No save yet is not an error"""
    load_state = require("load_state")
    if os.path.exists(SAVE):
        os.remove(SAVE)
    try:
        assert load_state(SAVE) == {}
    except FileNotFoundError:
        raise AssertionError("load_state should return {} when there is no save file.")


def test_corrupt_file():
    """A half-written save does not kill the game"""
    load_state = require("load_state")
    _write('{"room": "clear')
    try:
        result = load_state(SAVE)
    except Exception as exc:
        raise AssertionError(
            f"Corrupt JSON raised {type(exc).__name__}. json.JSONDecodeError is a "
            "subclass of ValueError, so one except clause covers it."
        )
    assert result == {}, f"Got {result}"


def test_valid_json_that_is_not_a_save():
    """null parses cleanly and is still not a save file"""
    load_state = require("load_state")
    for text in ("null", "[1, 2, 3]", '"hello"', "42"):
        _write(text)
        assert load_state(SAVE) == {}, (
            f"A file containing {text} loaded as {load_state(SAVE)!r}. It is valid "
            "JSON, which is exactly why checking the shape matters as well as the syntax."
        )
