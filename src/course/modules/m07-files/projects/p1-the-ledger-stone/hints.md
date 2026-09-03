Two workings that mirror each other. Write the saving one first and go and look
at the file it makes — the Files tab will show you exactly what you produced.
---
For saving: `with open(path, "w") as handle:` and a loop writing
`f"{name},{points}\n"` per row.

For loading: read the whole thing, `.splitlines()` it, and split each line on
the comma. Wrap the open in `try` / `except FileNotFoundError` and return `[]`.

Skip blank lines — a file ending in a newline gives you one.
---
```python
def save_scores(path, scores):
    with open(path, "w") as handle:
        for name, points in scores:
            handle.write(f"{name},{points}\n")


def load_scores(path):
    try:
        with open(path) as handle:
            text = handle.read()
    except FileNotFoundError:
        return []

    scores = []
    for line in text.splitlines():
        if not line.strip():
            continue
        name, points = line.split(",")
        scores.append((name, int(points)))
    return scores
```
