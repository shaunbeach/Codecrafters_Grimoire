## The situation

Apprentices are scored on every trial they attempt. The guild has decided —
after some lobbying — that everyone's worst attempt should be forgiven before an
average is taken.

## What good looks like

```python
judge([60, 90, 90])     # 90.0     the 60 is dropped
judge([10, 20])         # 20.0
judge([75])             # 0.0      drop the only score and nothing remains
judge([])               # 0.0
```

## Your objective

**`judge(scores)`** — drop the single lowest score and return the average of
what is left, as a `float` rounded to 2 decimal places.

With one score or none, there is nothing to average once the lowest is dropped,
so return `0.0`.

## Watch out for

Do not change the list you were handed. The trial record belongs to the guild;
`sorted(scores)` gives you a sorted copy, while `scores.sort()` rearranges
theirs.

Only **one** score is dropped, even when several are tied for lowest.
`[60, 60, 90]` drops one 60 and averages `60` and `90`.

Dividing by the length of an empty list raises `ZeroDivisionError`. Get the
short cases out of the way first.
