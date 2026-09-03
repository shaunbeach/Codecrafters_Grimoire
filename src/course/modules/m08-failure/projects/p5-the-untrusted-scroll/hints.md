Guard the whole input first — if it is not a dictionary there is nothing to
read, and you can return the defaults immediately.

After that, three fields, each handled on its own.
---
`record.get("name")` gives `None` when the key is missing, which is falsy — so
one test covers both "missing" and "blank".

For the age, `try: age = int(record.get("age"))` with
`except (ValueError, TypeError): age = 0` handles missing, `None`, `"30"` and
`"not telling"` in one go. Then a separate check for negatives.
---
```python
if not isinstance(record, dict):
    return {"name": "anonymous", "age": 0, "town": "unknown"}

name = str(record.get("name") or "").strip() or "anonymous"
town = str(record.get("town") or "").strip() or "unknown"

try:
    age = int(record.get("age"))
except (ValueError, TypeError):
    age = 0
if age < 0:
    age = 0

return {"name": name, "age": age, "town": town}
```
