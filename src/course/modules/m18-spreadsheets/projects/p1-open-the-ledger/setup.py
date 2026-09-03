# Puts the ledger on the counter.
from openpyxl import Workbook

book = Workbook()
accounts = book.active
accounts.title = "Accounts"
accounts.append(["Account", "Balance", "Currency"])
accounts.append(["Reserve", 1250.0, "GBP"])
accounts.append(["Petty cash", 87.5, "GBP"])
accounts.append(["Bond", 9400.0, "GBP"])

notes = book.create_sheet("Notes")
notes.append(["Note"])
notes.append(["Reconciled to the end of March."])

book.save("ledger.xlsx")
