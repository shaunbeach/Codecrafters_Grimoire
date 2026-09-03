LEDGER = "ledger.xlsx"


def test_sheet_names():
    """sheet_names lists the tabs in order"""
    sheet_names = require("sheet_names")
    result = sheet_names(LEDGER)
    assert isinstance(result, list), f"Expected a list, got {type(result).__name__}."
    assert result == ["Accounts", "Notes"], (
        f"Got {result}. book.sheetnames is already the list you want, in tab order."
    )


def test_read_header_cell():
    """read_cell returns the text in a header cell"""
    read_cell = require("read_cell")
    value = read_cell(LEDGER, "Accounts", "A1")
    assert value == "Account", (
        f"Got {value!r}. A worksheet index gives you a cell object; the text is on .value."
    )


def test_read_number_cell():
    """Numbers come back as numbers, not strings"""
    read_cell = require("read_cell")
    value = read_cell(LEDGER, "Accounts", "B2")
    assert value == 1250.0, f"Expected 1250.0, got {value!r}"
    assert isinstance(value, (int, float)), (
        f"B2 came back as {type(value).__name__}; openpyxl preserves the number."
    )


def test_read_second_sheet():
    """The sheet argument is actually used"""
    read_cell = require("read_cell")
    value = read_cell(LEDGER, "Notes", "A2")
    assert value == "Reconciled to the end of March.", (
        f"Got {value!r} — check you are opening the sheet you were asked for, "
        "rather than always using book.active."
    )


def test_blank_cell():
    """An empty cell is None"""
    read_cell = require("read_cell")
    assert read_cell(LEDGER, "Accounts", "F9") is None, (
        "A cell nobody has written to reads back as None."
    )
