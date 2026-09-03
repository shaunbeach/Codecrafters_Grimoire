A counter before the loop, one `if` inside it, return after. The only new part
is that you are looping over an open file rather than a list.
---
`for line in handle:` gives you one line at a time, each still carrying its
newline — so `.strip()` before you test it.

Build the thing you are looking for once: `prefix = level + ":"`.

Wrap the whole open in `try` / `except FileNotFoundError` and return `0`.
---
```python
try:
    with open(path) as handle:
        count = 0
        for line in handle:
            if line.strip().startswith(level + ":"):
                count += 1
        return count
except FileNotFoundError:
    return 0
```
