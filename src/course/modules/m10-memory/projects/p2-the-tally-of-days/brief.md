## The situation

**Step 2 of 2 — The Vault.**

The stone remembers. Now give it something worth remembering: a day recorded,
and a report of who is doing best.

`load_habits` and `save_habits` are already in this file.

## What good looks like

```python
habits = load_habits("habits.txt")     # {} on the very first run
record_day(habits, "reading")          # 1
record_day(habits, "reading")          # 2
save_habits("habits.txt", habits)

load_habits("habits.txt")              # {'reading': 2}

streak_report({"reading": 12, "exercise": 5, "art": 12})
# ['art: 12 days', 'reading: 12 days', 'exercise: 5 days']
```

## Your objective

**`record_day(habits, name)`** — add one day to that habit, starting from 0 if
it is new, and return the new count.

**`streak_report(habits)`** — return a list of strings sorted by count, **highest
first**, with ties broken alphabetically.

## Watch out for

`record_day` is one line if you remember `.get(name, 0)` — the same line you
wrote in the quartermaster's book, doing the same job.

Two sort keys at once: `sorted(habits.items(), key=lambda e: (-e[1], e[0]))`.
Negating the count sorts it descending while the name still sorts ascending,
which is exactly the "highest first, ties alphabetical" rule.
