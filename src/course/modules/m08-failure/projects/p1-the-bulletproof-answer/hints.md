Both workings are the same shape: try the thing that might fail, and hand back a
sensible default when it does.
---
For `safe_int`, the `try` body is a single `return int(text)`. The `except`
needs **two** exception types, because `None` and `"banana"` fail in different
ways: `except (ValueError, TypeError):`.

For `average`, the division is what raises, so the `try` wraps the whole
calculation.
---
```python
def safe_int(text, default=0):
    try:
        return int(text)
    except (ValueError, TypeError):
        return default


def average(numbers):
    try:
        return sum(numbers) / len(numbers)
    except ZeroDivisionError:
        return 0.0
```
