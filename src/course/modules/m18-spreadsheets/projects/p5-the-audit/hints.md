Find the rows that need attention first. Just print them, and get the row
numbers right, before you ask a single question. The conversation is the easy
half; the counting is where this goes wrong.
---
A cell is "empty or zero" exactly when `not sheet.cell(...).value` — both `None`
and `0` are falsy, so one test covers both.

For the answer, `try: units = int(answer)` with an `except ValueError:` is the
whole of the validation. Remember that a fix has to do two things: write the
cell *and* count.
---
```python
answer = input('units> ')
try:
    units = int(answer)
except ValueError:
    skipped += 1
    continue

if units < 0:
    skipped += 1
    continue

sheet.cell(row=r, column=3, value=units)
fixed += 1
```

and after the loop closes, `book.save(path)` — or none of it happened.
