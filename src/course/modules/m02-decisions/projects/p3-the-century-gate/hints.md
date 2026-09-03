Work the exceptions from the outside in. The most specific rule — divisible by
400 — is the one that should be tested first, because anything that satisfies it
is a leap year regardless of what the other rules say.
---
Three questions, in this order: is it divisible by 400? then, is it divisible by
100? then, is it divisible by 4?

The middle one is the only one that returns `False` — a year divisible by 100
but not 400 is the exception the calendar makes.
---
```python
if year % 400 == 0:
    return True
if year % 100 == 0:
    return False
return year % 4 == 0
```

That last line already produces a boolean, so there is no need to wrap it in an
`if` that returns `True` or `False`.
