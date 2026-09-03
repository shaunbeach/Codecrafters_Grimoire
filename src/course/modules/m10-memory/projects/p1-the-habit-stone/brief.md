## The situation

**Step 1 of 2 — The Vault.**

A habit tracker is worthless if it forgets. This step is the two halves of
remembering: writing the tracker down in a format you chose, and reading it back
so exactly that you cannot tell it ever left.

The format is one habit per line:

```
art:3
exercise:5
reading:12
```

## What good looks like

```python
save_habits("habits.txt", {"reading": 12, "art": 3})
load_habits("habits.txt")        # {'art': 3, 'reading': 12}

load_habits("nothing.txt")       # {}
```

A file somebody has been editing by hand:

```
reading:12

nonsense
exercise:lots
art:3
```

```python
load_habits("messy.txt")         # {'reading': 12, 'art': 3}
```

## Your objective

**`load_habits(path)`** — return `{name: count}`. A missing file gives `{}`.
Blank lines, lines with no colon, and lines whose count is not a whole number
are **skipped** rather than fatal.

**`save_habits(path, habits)`** — write one `name:count` per line, **sorted by
name**.

## Watch out for

Sorting on save is what makes the file deterministic: the same data produces a
byte-identical file every run, so it can go in version control and be compared
with yesterday's.

`partition(":")` splits on the first colon and always returns three pieces, so
it cannot raise the way unpacking a `split()` can.

The tracker's first run has no file. That is the normal beginning, not an error.
