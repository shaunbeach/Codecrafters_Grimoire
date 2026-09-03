GRADES = "/data/grades.csv"


def test_rows_are_dicts():
    """parse_csv keys each row by the header names"""
    parse_csv = require("parse_csv")
    rows = parse_csv(GRADES)
    assert isinstance(rows, list), f"Expected a list, got {type(rows).__name__}."
    assert len(rows) == 4, f"The file has four students; parse_csv found {len(rows)}."
    assert rows[0] == {"name": "Kira", "maths": "88", "science": "92", "history": "79"}, (
        f"The first row came out as {rows[0]}"
    )


def test_header_is_not_a_row():
    """The header line describes the columns; it is not data"""
    parse_csv = require("parse_csv")
    rows = parse_csv(GRADES)
    assert rows[0]["name"] != "name", (
        "The header row ended up in your data. Skip lines[0] once you have "
        "used it for the keys."
    )


def test_values_stay_strings():
    """Values are left as strings for the caller to convert"""
    parse_csv = require("parse_csv")
    row = parse_csv(GRADES)[0]
    assert isinstance(row["maths"], str), (
        f"Values should stay as strings, got {type(row['maths']).__name__}."
    )


def test_single_row_file():
    """A file with one student still works"""
    parse_csv = require("parse_csv")
    rows = parse_csv("/data/tiny.csv")
    assert rows == [{"name": "Solo", "score": "42"}], f"Got {rows}"
