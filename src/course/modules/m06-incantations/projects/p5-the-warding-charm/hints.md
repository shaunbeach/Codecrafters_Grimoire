Four questions, asked in order, each with its own `return`. The last line of the
working is the only happy one.
---
`len(phrase) < 12` is the first.

For the rest, `any(...)` over the characters: `any(c.isupper() for c in phrase)`
is true when at least one is a capital. Note the difference from
`phrase.isupper()`, which asks whether they all are.

`.islower()` and `.isdigit()` work the same way.
---
```python
if len(phrase) < 12:
    return "too short"
if not any(c.isupper() for c in phrase):
    return "needs a capital"
if not any(c.islower() for c in phrase):
    return "needs a lowercase letter"
if not any(c.isdigit() for c in phrase):
    return "needs a digit"
return "ACCEPTED"
```
