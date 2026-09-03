import json

CSV = "/data/roster.csv"
JSON = "/workspace/roster.json"


def _load():
    with open(JSON) as handle:
        return json.load(handle)


def test_returns_the_row_count():
    """It reports how many rows it converted"""
    csv_to_json = require("csv_to_json")
    reset_roster()
    assert csv_to_json(CSV, JSON) == 3, f"Got {csv_to_json(CSV, JSON)!r}"


def test_writes_a_json_array():
    """The output is a list of objects"""
    csv_to_json = require("csv_to_json")
    reset_roster()
    csv_to_json(CSV, JSON)
    data = _load()
    assert isinstance(data, list) and len(data) == 3, f"Got {data!r}"
    assert isinstance(data[0], dict), f"Each row should be an object, got {data[0]!r}"


def test_keys_come_from_the_header():
    """The CSV header becomes the JSON keys"""
    csv_to_json = require("csv_to_json")
    reset_roster()
    csv_to_json(CSV, JSON)
    assert set(_load()[0]) == {"name", "level", "town"}, f"Got {sorted(_load()[0])}"


def test_levels_are_numbers():
    """The boundary conversion actually happens"""
    csv_to_json = require("csv_to_json")
    reset_roster()
    csv_to_json(CSV, JSON)
    level = _load()[0]["level"]
    assert level == 7 and isinstance(level, int), (
        f"level came through as {level!r} ({type(level).__name__}). Everything out of "
        "a CSV is a string; JSON knows the difference and the service will care."
    )


def test_other_fields_stay_strings():
    """Only the number column is converted"""
    csv_to_json = require("csv_to_json")
    reset_roster()
    csv_to_json(CSV, JSON)
    assert _load()[0]["town"] == "Marrow Ford", f"Got {_load()[0]}"


def test_bad_level_becomes_zero():
    """A level that will not convert does not stop the run"""
    csv_to_json = require("csv_to_json")
    reset_roster()
    with open(CSV, "w", newline="") as handle:
        handle.write("name,level,town\nRex,unranked,Ashwell\n")
    try:
        csv_to_json(CSV, JSON)
    except ValueError:
        raise AssertionError("int('unranked') raises ValueError — catch it and use 0.")
    assert _load()[0]["level"] == 0, f"Got {_load()[0]}"
