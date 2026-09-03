# Builds the sales workbook. Exposed as a function as well as run once, so a
# test that changes the file can put it back before the next one runs.
from openpyxl import Workbook

ROWS = [
    ("North", "January", 120, 4.5),
    ("North", "February", 95, 4.5),
    ("South", "January", 80, 4.5),
    ("South", "February", 140, 5.0),
    ("East", "January", 60, 5.0),
    ("East", "February", 0, 5.0),
    ("West", "January", 210, 3.75),
    ("West", "February", None, 3.75),
]


def reset_sales(path="sales.xlsx"):
    """Put the workbook back to its original state."""
    book = Workbook()
    sheet = book.active
    sheet.title = "Sales"
    sheet.append(["Region", "Month", "Units", "Unit Price"])
    for row in ROWS:
        sheet.append(list(row))
    book.save(path)


reset_sales()
