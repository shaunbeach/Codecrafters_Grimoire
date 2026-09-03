## The situation

**Step 1 of 2 — The Insistent Prompt.**

Two small workings that will be called from everywhere, by code that has no idea
what it is handing over. Their job is not to be clever. Their job is to be
impossible to break.

## What good looks like

```python
safe_int("42")           # 42
safe_int("  8  ")        # 8
safe_int("banana")       # 0
safe_int("banana", -1)   # -1
safe_int(None)           # 0

average([1, 2, 3])       # 2.0
average([])              # 0.0
```

## Your objective

**`safe_int(text, default=0)`** — return `int(text)`, or `default` when that is
impossible. It must never raise, whatever it is handed — including `None` and a
list.

**`average(numbers)`** — the mean, using `try` / `except ZeroDivisionError` to
return `0.0` for an empty list.

## Watch out for

`int("banana")` raises `ValueError`. `int(None)` raises **`TypeError`** — a
different exception entirely, and the one people forget. Catch both.

For the average, do it with `try`/`except` rather than an `if`. You could check
the length first and it would work; the point of the drill is to feel the
difference between asking permission and asking forgiveness, because for a file
or a network call the second is often the only one that is actually safe.
