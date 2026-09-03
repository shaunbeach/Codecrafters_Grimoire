Two guards, then the arithmetic. Both guards go at the very top, before any
calculation — that is the point of the drill.
---
Check the type first: `isinstance(weight, (int, float))` and
`not isinstance(weight, bool)`. Then check the value.

`type(weight).__name__` gives you `'str'` for the message.

For the fare: `5.0 + 2.0 * (int(weight) - 1)` for anything over one stone, and
`5.0` at or below one.
---
```python
if isinstance(weight, bool) or not isinstance(weight, (int, float)):
    raise TypeError(f"weight must be a number, got {type(weight).__name__}")
if weight <= 0:
    raise ValueError(f"weight must be above zero, got {weight}")

stones = int(weight)
if stones <= 1:
    return 5.0
return 5.0 + 2.0 * (stones - 1)
```
