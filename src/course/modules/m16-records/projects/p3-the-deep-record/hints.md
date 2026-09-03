A loop over the steps, reassigning `current` each time. The check happens before
each step, not after.
---
For a string step: `isinstance(current, dict)` and `step in current`.

For an integer step: `isinstance(current, list)` and
`0 <= step < len(current)`.

Anything else — wrong container, missing key, position out of range — returns
`default` straight away.
---
```python
current = data
for step in path:
    if isinstance(step, int):
        if not isinstance(current, list) or not (0 <= step < len(current)):
            return default
    else:
        if not isinstance(current, dict) or step not in current:
            return default
    current = current[step]
return current
```
