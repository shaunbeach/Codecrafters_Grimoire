Read the whole file, `.splitlines()` it, and take the first line off for the
header. Everything after it is a row.
---
`lines[0].split(",")` gives you the column names. Then loop over `lines[1:]`,
split each on the comma, and pair them up.

Guard the empty file: `if not lines: return []` before you index `lines[0]`.
---
```python
with open(path) as handle:
    lines = handle.read().splitlines()

if not lines:
    return []

headers = lines[0].split(",")
rows = []
for line in lines[1:]:
    if not line.strip():
        continue
    rows.append(dict(zip(headers, line.split(","))))
return rows
```
