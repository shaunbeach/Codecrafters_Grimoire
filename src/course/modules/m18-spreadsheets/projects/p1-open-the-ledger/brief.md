## The situation

A ledger has been left on the counter of the counting house: `ledger.xlsx`. Two
leaves, a few dozen figures, and nobody left who remembers what is written on the
second one.

Before you may change a thing, you must be able to look at it. That is all this
working asks. Put the lens to the seal and read.

## What good looks like

```python
sheet_names('ledger.xlsx')
# ['Accounts', 'Notes']

read_cell('ledger.xlsx', 'Accounts', 'A1')
# 'Account'

read_cell('ledger.xlsx', 'Accounts', 'B2')
# 1250.0
```

## Your objective

**`sheet_names(path)`** — return the workbook's sheet titles, in the order the
tabs appear.

**`read_cell(path, sheet, ref)`** — return the value in one cell of one sheet.
`ref` is an ordinary coordinate like `'B2'`. A blank cell returns `None`, which
is what openpyxl already hands you.

## Watch out for

`sheet['A1']` gives you the cell, not what is in it. The value is on `.value`.

A sheet that does not exist raises `KeyError`. Let it. Someone asking for a leaf
that was never bound into the book has made a mistake worth hearing about, and
swallowing it only moves the confusion somewhere less useful.
