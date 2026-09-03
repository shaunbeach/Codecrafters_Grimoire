## The situation

**Step 1 of 2 — The High Table.**

The guild keeps its scores on a slate by the door, and somebody wipes the slate
every night. Nobody can remember who held the record last month.

Cut it into stone instead. This step is the two halves of that: writing it down,
and reading it back exactly as it went in.

## What good looks like

```python
save_scores("hi.txt", [("Kira", 900), ("Bo", 750)])
load_scores("hi.txt")          # [('Kira', 900), ('Bo', 750)]

load_scores("nothing.txt")     # []
```

The file itself:

```
Kira,900
Bo,750
```

## Your objective

**`save_scores(path, scores)`** — `scores` is a list of `(name, points)` tuples.
Write one `name,points` per line, each ending in a newline. Overwrite whatever
was there.

**`load_scores(path)`** — read that file back into a list of `(name, points)`
tuples with `points` as an **`int`**. A missing file gives `[]`, and so does an
empty one.

## Watch out for

`write()` does not add newlines. Without the `\n` your whole table becomes one
line, which loads back as one very strange score.

Everything read from a file is text. `"900"` is not `900`, and a test that
compares them will tell you so.

The first time this ever runs, the file does not exist. That is not an error
condition — it is the normal beginning.
