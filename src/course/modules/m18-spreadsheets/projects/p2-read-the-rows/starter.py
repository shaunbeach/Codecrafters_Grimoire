from openpyxl import load_workbook


def load_sales(path):
    # your code here
    pass


if __name__ == "__main__":
    # Press Run to try this out and watch it work.
    # Check ignores everything in here, so a demo call cannot break grading.
    for row in load_sales("sales.xlsx"):
        print(row)
