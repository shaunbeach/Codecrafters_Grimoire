An unbounded loop with a way out. The way out is the `return`, and it lives
inside the `try`.
---
```python
while True:
    try:
        ...
    except ValueError:
        print(...)
```

The whole of the `try` body is one line: read, convert, return. If the
conversion raises, the `return` never happens and the `except` runs instead.
---
```python
while True:
    try:
        return int(input(prompt))
    except ValueError:
        print("That is not a whole number.")
```

Four lines. Note that `safe_int` is no help here — you specifically do not want
a default, you want to keep asking.
