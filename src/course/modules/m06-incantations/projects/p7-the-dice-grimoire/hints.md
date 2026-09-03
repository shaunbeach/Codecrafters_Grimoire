Get the rolls once, into a variable, and then answer all four questions from
that same list. Rolling separately for the total and the highest would give you
numbers that do not agree with each other.
---
`sum()`, `max()` and `min()` each take a list and give you one number. That is
`roll_stats` almost entirely.

For `best_of`: the sum of everything, minus the smallest, is the sum of
everything except the smallest — no sorting or slicing needed.
---
```python
def roll_stats(count, sides):
    rolls = dice.roll_many(count, sides)
    return {
        "rolls": rolls,
        "total": sum(rolls),
        "highest": max(rolls),
        "lowest": min(rolls),
    }


def best_of(count, sides):
    rolls = dice.roll_many(count, sides)
    if len(rolls) <= 1:
        return sum(rolls)
    return sum(rolls) - min(rolls)
```
