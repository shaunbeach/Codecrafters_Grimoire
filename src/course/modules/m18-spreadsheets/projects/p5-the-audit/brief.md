## The situation

Two rows in the ledger have no units set against them. Somebody has to decide
what they ought to be — and that somebody is not the program.

This is the one working in the module that stops. Press **Run** and it will
print a question and wait. Not a performance of waiting: the Python interpreter
is genuinely parked, and nothing moves until you press Enter.

Automation is not the removal of judgement. It is the removal of everything
around the judgement, so that the only thing left for a person to do is the one
thing a person is for.

## What good looks like

```
Row 7: East February has no units.
units> 45
Row 9: West February has no units.
units> skip
Audit complete: 1 fixed, 1 skipped.
```

```python
run_audit('sales.xlsx')
# {'checked': 2, 'fixed': 1, 'skipped': 1}
```

## Your objective

**`run_audit(path)`** — walk the rows of figures. A row needs attention when its
`Units` cell is empty or `0`. For each one, in the order they appear:

1. print `Row {n}: {Region} {Month} has no units.` — `n` is the spreadsheet row
   number, so the first row of figures is 7 in the example above
2. read an answer with `input("units> ")`
3. a whole number is written into the `Units` cell and counts as **fixed**
4. anything else — `skip`, a blank line, `banana` — leaves the cell alone and
   counts as **skipped**

Then save the workbook in place, print
`Audit complete: {fixed} fixed, {skipped} skipped.` and return
`{'checked': …, 'fixed': …, 'skipped': …}`.

## Watch out for

The starter ends with an `if __name__ == "__main__":` block, and it is not
decoration. **Run** executes your file, so the block fires and the audit is a
conversation. **Check** imports it, so the block is skipped and the hidden tests
answer the prompts themselves. Put any try-it-out call inside it and grading can
never trip over it.

A typo must not end the audit. `int('banana')` raises `ValueError`, and a tool
that dies on the second of forty rows is worse than no tool at all.

Negative units are not units. Treat them as a skip.
