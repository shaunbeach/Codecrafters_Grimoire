from openpyxl import load_workbook


def sheet_names(path):
    # your code here
    pass


def read_cell(path, sheet, ref):
    # your code here
    pass


if __name__ == "__main__":
    # Press Run to try this out and watch it work.
    # Check ignores everything in here, so a demo call cannot break grading.
    print(sheet_names("ledger.xlsx"))
    print(read_cell("ledger.xlsx", "Accounts", "A1"))
