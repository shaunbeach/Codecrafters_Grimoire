## The situation

The guildhall keeps a herald at the door whose entire job is to shout the names
of people arriving. She has been doing it for thirty years and she is tired.

Write the working that does it for her.

## What good looks like

```python
announce("Kira")
# 'Make way for KIRA, whose name is 4 letters long.'

announce("Bo")
# 'Make way for BO, whose name is 2 letters long.'

announce("")
# 'Make way for a stranger with no name.'
```

## Your objective

**`announce(name)`** — return the cry as a string. Do not print it; the herald
decides when to shout.

- the name is shouted in capitals
- the count is how many characters the name has
- an empty name gets the stranger's line instead

## Watch out for

`len()` counts characters, not words. `len("Kira")` is 4.

Handle the empty name first and return straight away. That is a **guard
clause**, and it keeps the interesting half of the working from being wrapped in
an `else`.
