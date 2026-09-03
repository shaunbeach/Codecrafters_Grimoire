Two jobs, not one. Find which column is free, then walk the rows writing into
it. `sheet.max_column` tells you how wide the ledger currently is — the first
free column is one past that.
---
`sheet.cell(row=r, column=c, value=x)` writes a cell by number, which is what
you want inside a loop.

Your rows run from 2 up to and including `sheet.max_row`, so
`range(2, sheet.max_row + 1)`. Read `Units` and `Unit Price` out of columns 3
and 4 of the same row.
---
```python
total_column = sheet.max_column + 1
sheet.cell(row=1, column=total_column, value='Total')

written = 0
for r in range(2, sheet.max_row + 1):
    units = sheet.cell(row=r, column=3).value or 0
    price = sheet.cell(row=r, column=4).value or 0
    sheet.cell(row=r, column=total_column, value=units * price)
    written += 1

book.save(path)
return written
```
