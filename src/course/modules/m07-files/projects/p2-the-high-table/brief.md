## The situation

**Step 2 of 2 — The High Table.**

The stone holds, but it holds everything — three years of scores, in the order
they happened, and nobody can see who is actually winning.

The high table seats five. `save_scores` and `load_scores` are already in this
file, exactly as you left them.

## What good looks like

```python
save_scores("hi.txt", [("Kira", 900), ("Bo", 750)])

add_score("hi.txt", "Ana", 800)
# [('Kira', 900), ('Ana', 800), ('Bo', 750)]
```

And on disk, the file now says the same thing — the change survived.

## Your objective

**`add_score(path, name, points)`** — load the table, add the new score, sort it
highest first, keep only the top five, save it back, and return the kept list.

## Watch out for

Five lines of working, and every one of them is a step you have already written
somewhere. The skill here is not new syntax; it is seeing that "load, change,
save" is a shape you will now write for the rest of your life.

`sort()` rearranges the list and returns `None`. `sorted()` gives you a new one.
Either is fine — just do not assign the result of `sort()` to anything.

Sorting tuples by their second value needs a key: `key=lambda entry: entry[1]`.
`reverse=True` puts the biggest first.
