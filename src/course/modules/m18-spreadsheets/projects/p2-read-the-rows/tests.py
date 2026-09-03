SALES = "sales.xlsx"


def test_returns_dictionaries():
    """load_sales returns one dictionary per data row"""
    load_sales = require("load_sales")
    rows = load_sales(SALES)
    assert isinstance(rows, list), f"Expected a list, got {type(rows).__name__}."
    assert len(rows) == 8, (
        f"The sheet has 8 data rows under the header; you returned {len(rows)}. "
        "The header row is not data."
    )
    assert isinstance(rows[0], dict), f"Each row should be a dict, got {type(rows[0]).__name__}."


def test_keys_come_from_the_header():
    """The header row becomes the keys"""
    load_sales = require("load_sales")
    row = load_sales(SALES)[0]
    assert set(row) == {"Region", "Month", "Units", "Unit Price"}, (
        f"Got the keys {sorted(row)}. They should be the header names, exactly as written."
    )


def test_first_row_values():
    """Values survive the trip intact"""
    load_sales = require("load_sales")
    row = load_sales(SALES)[0]
    assert row == {"Region": "North", "Month": "January", "Units": 120, "Unit Price": 4.5}, (
        f"Got {row}"
    )


def test_header_is_not_a_row():
    """'Region' is a column name, not a region"""
    load_sales = require("load_sales")
    regions = [row["Region"] for row in load_sales(SALES)]
    assert "Region" not in regions, (
        "The header row ended up in your data. Use it for the keys, then skip it."
    )


def test_blank_units_become_zero():
    """The empty Units cell is normalised to 0"""
    load_sales = require("load_sales")
    rows = load_sales(SALES)
    west_february = [r for r in rows if r["Region"] == "West" and r["Month"] == "February"][0]
    assert west_february["Units"] == 0, (
        f"West/February has an empty Units cell and came back as "
        f"{west_february['Units']!r}. openpyxl reads a blank cell as None; turn it into 0."
    )


def test_real_zero_is_kept():
    """A cell containing 0 is not confused with a blank one"""
    load_sales = require("load_sales")
    rows = load_sales(SALES)
    east_february = [r for r in rows if r["Region"] == "East" and r["Month"] == "February"][0]
    assert east_february["Units"] == 0
    assert east_february["Unit Price"] == 5.0, (
        "Only Units should be normalised — the other columns are left alone."
    )
