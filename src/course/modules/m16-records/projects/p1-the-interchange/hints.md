Saving is one `with` and one `json.dump`. Loading is the same shape you have
written for every file so far, plus one extra check at the end.
---
`json.dump(state, handle, indent=2, sort_keys=True)`.

For loading, catch `(FileNotFoundError, ValueError)` — `JSONDecodeError` is a
subclass of `ValueError`, so one clause covers both the missing file and the
broken one.

Then, before returning, `isinstance(data, dict)`.
---
```python
def load_state(path):
    try:
        with open(path) as handle:
            data = json.load(handle)
    except (FileNotFoundError, ValueError):
        return {}

    if not isinstance(data, dict):
        return {}
    return data
```
