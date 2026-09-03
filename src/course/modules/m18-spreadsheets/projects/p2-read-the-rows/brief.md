## The situation

**Step 1 of 3 — The Quarterly Ledger.**

Three workings, one job. You will take a sales ledger, transmute a computed
column into it, and draw a summary out of what results. This is the foundation:
getting the rows out of the sealed book and into a shape Python can actually
hold.

`sales.xlsx` has a header row and eight rows of figures:

| Region | Month | Units | Unit Price |
| --- | --- | --- | --- |
| North | January | 120 | 4.5 |
| South | February | 140 | 5.0 |
| … | | | |

## What good looks like

```python
rows = load_sales('sales.xlsx')

len(rows)        # 8
rows[0]          # {'Region': 'North', 'Month': 'January', 'Units': 120, 'Unit Price': 4.5}
rows[0]['Units'] # 120
```

## Your objective

**`load_sales(path)`** — return a list of dictionaries, one per row of figures,
keyed by the header names exactly as they are written in row 1.

- the header is not data; it must not appear in the result
- a blank `Units` cell becomes `0`, not `None`, so the next step can do
  arithmetic without inspecting every row first
- every other value is left exactly as openpyxl hands it over

## Watch out for

The last row has an empty `Units` cell. That is not an oversight — it is the row
that will break step 2 if you do not deal with it here. Ledgers kept by people
always have one.
