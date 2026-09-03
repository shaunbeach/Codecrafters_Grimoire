## The situation

**Step 1 of 2 — The Cohort.**

The examiners keep their marks in a file called `/data/grades.csv`, and every
question anyone asks about it currently involves counting on fingers.

```
name,maths,science,history
Kira,88,92,79
Bo,71,65,80
Ana,95,99,91
Rex,60,72,58
```

Before you can answer anything, you have to get it out of the file and into a
shape Python can hold. That is this step, and nothing else.

## What good looks like

```python
rows = parse_csv("/data/grades.csv")

len(rows)     # 4
rows[0]       # {'name': 'Kira', 'maths': '88', 'science': '92', 'history': '79'}
```

## Your objective

**`parse_csv(path)`** — return a list of dictionaries, one per data row, keyed
by the header names.

- all values stay as **strings**; converting is the next step's problem
- blank lines are skipped
- a file with only a header gives `[]`

Import nothing. Python has a `csv` module and you will use it in real work —
writing it once by hand is how you learn what it does for you.

## Watch out for

The header is not data. It is the thing you build the keys from, and then it
must not appear in the result.

`dict(zip(headers, values))` marries the two tuples in one move.
