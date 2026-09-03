## The situation

**Step 3 of 3 — The Quarterly Ledger.**

You have read the book and transmuted a column into it. Now draw out the thing
somebody actually asked for: one line per region, and a grand total beneath.

This working conjures a **new** ledger. The source is left exactly as you found
it — which is the difference between a report and an accident.

## What good looks like

`summary.xlsx`, one leaf named `Summary`:

| | A | B | C |
| --- | --- | --- | --- |
| **1** | Region | Units | Revenue |
| **2** | East | 60 | 300.0 |
| **3** | North | 215 | 967.5 |
| **4** | South | 220 | 1060.0 |
| **5** | West | 210 | 787.5 |
| **6** | TOTAL | 705 | 3115.0 |

```python
build_summary('sales.xlsx', 'summary.xlsx')
# {'East': 300.0, 'North': 967.5, 'South': 1060.0, 'West': 787.5}
```

## Your objective

**`build_summary(source, destination)`** —

- read every row of figures from `source`
- group by `Region`, summing `Units` and revenue (`Units × Unit Price`)
- write `destination` with the sheet named `Summary`, the header row above, and
  one row per region **sorted alphabetically**
- close with a `TOTAL` row summing every region
- make row 1 bold
- return a dict of `{region: revenue}` — regions only, no TOTAL

## Watch out for

Revenue comes from `Units × Unit Price` on each row, not from the `Total` column
you added in step 2. This working has to stand on its own against a ledger that
never passed through that step.

Sort the regions. A report whose row order shifts between runs is a report
nobody can compare against last quarter's.
