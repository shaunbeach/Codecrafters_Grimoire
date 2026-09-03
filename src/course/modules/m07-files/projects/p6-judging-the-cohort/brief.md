## The situation

**Step 2 of 2 — The Cohort.**

`parse_csv` is already in this file. The rows are in memory. Now answer the two
questions the examiners actually have: how did the cohort do in each subject,
and who is the best all-rounder.

## What good looks like

```python
rows = parse_csv("/data/grades.csv")

class_average(rows, "maths")     # 78.5
class_average([], "maths")       # 0.0
top_student(rows)                # 'Ana'
```

## Your objective

**`class_average(rows, column)`** — the mean of one column, rounded to 2 decimal
places. An empty list of rows gives `0.0`.

**`top_student(rows)`** — the `name` of the student with the highest average
across every column **except** `name`.

## Watch out for

Everything that came out of the file is a string. `sum(["88", "92"])` raises
`TypeError`; convert with `int()` as you go.

Dividing by the length of an empty list raises `ZeroDivisionError`. An empty
result set is not an exotic case — it is what you get on the first day, before
anyone has been marked.

`top_student` must skip the `name` column. Trying to average somebody's name is
a `ValueError`, and it is the mistake this one is designed to catch.
