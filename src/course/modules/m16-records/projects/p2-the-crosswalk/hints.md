`csv.DictReader` gives you a dict per row with the header as keys — the working
you wrote by hand in the archive, already made.
---
```python
with open(csv_path, newline="") as handle:
    rows = list(csv.DictReader(handle))
```

Then fix up each row's `level` before writing. `int()` in a `try`, falling back
to `0`.

Write with `json.dump(rows, handle, indent=2)`.
---
```python
with open(csv_path, newline="") as handle:
    rows = list(csv.DictReader(handle))

for row in rows:
    try:
        row["level"] = int(row["level"])
    except (ValueError, TypeError):
        row["level"] = 0

with open(json_path, "w") as handle:
    json.dump(rows, handle, indent=2)

return len(rows)
```
