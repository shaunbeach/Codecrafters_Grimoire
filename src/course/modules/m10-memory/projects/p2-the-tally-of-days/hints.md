The recording half you have written before, in another module, about gold.
`habits.get(name, 0) + 1`.
---
For the report, sort the `.items()` pairs rather than the keys, because you need
both halves — the count to order by and the name to print.

A key function returning a **tuple** sorts by the first element, then the second
where they tie.
---
```python
def record_day(habits, name):
    habits[name] = habits.get(name, 0) + 1
    return habits[name]


def streak_report(habits):
    ordered = sorted(habits.items(), key=lambda entry: (-entry[1], entry[0]))
    return [f"{name}: {count} days" for name, count in ordered]
```
