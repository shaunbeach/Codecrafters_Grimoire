Write the saving half first — it is three lines — then look at the file it
produced in the Files tab and write the reader against what you actually see.
---
For saving: `for name in sorted(habits):` and write `f"{name}:{habits[name]}\n"`.

For loading: wrap the open in `try` / `except FileNotFoundError` returning `{}`.
Then for each line: strip it, skip if empty or `":" not in line`, partition, and
skip if the count is not made of digits.
---
```python
def load_habits(path):
    try:
        with open(path) as handle:
            text = handle.read()
    except FileNotFoundError:
        return {}

    habits = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        name, _, count = line.partition(":")
        count = count.strip()
        if not count.lstrip("-").isdigit():
            continue
        habits[name.strip()] = int(count)
    return habits
```
