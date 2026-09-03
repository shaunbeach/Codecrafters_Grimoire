Guard the short lists first — fewer than two scores means there is nothing left
after the drop, so return `0.0` before you do anything else.
---
`sorted(scores)` gives you a new list, lowest first. Everything except the
lowest is then `[1:]` — a slice from position 1 to the end.

`sum(rest) / len(rest)` is the average, and `round(..., 2)` finishes it.
---
```python
if len(scores) < 2:
    return 0.0

rest = sorted(scores)[1:]
return round(sum(rest) / len(rest), 2)
```

Slicing a sorted copy means the guild's list is never touched.
