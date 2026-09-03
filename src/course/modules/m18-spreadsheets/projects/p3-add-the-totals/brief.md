## The situation

**Step 2 of 3 — The Quarterly Ledger.**

You can read the book. Now change it.

The ledger records `Units` and `Unit Price`, and nobody has ever worked out what
a single row is actually worth. Add a `Total` column and fill it — writing back
into the same file, exactly where the person doing this by hand would have
written it.

This is the first working where the **Files** tab earns its keep. Run it, then
open it: the cells your code touched are lit up. If your loop skipped a row or
began one too early, you will see precisely which cell it was, without reading a
line of your own code.

## What good looks like

Before:

| | A | B | C | D |
| --- | --- | --- | --- | --- |
| **1** | Region | Month | Units | Unit Price |
| **2** | North | January | 120 | 4.5 |

After:

| | A | B | C | D | E |
| --- | --- | --- | --- | --- | --- |
| **1** | Region | Month | Units | Unit Price | **Total** |
| **2** | North | January | 120 | 4.5 | **540.0** |

```python
add_totals('sales.xlsx')
# 8
```

## Your objective

**`add_totals(path)`** —

- write `Total` as the header of the first empty column
- for each row of figures, write `Units × Unit Price` into that column
- an empty `Units` cell counts as `0`, giving a total of `0.0`
- save the workbook **back to the same path**
- return the number of rows you filled in, as an `int`

## Watch out for

Row 1 is the header, so your figures begin at row 2. Write the first total into
row 1 and you erase the word `Total` — and the lit cells in the Files tab will
tell you so immediately.

`save()` rewrites the whole file. Saving to the path you were handed is what "in
place" means here. Nothing you assign to a cell exists on disk until you do it.
