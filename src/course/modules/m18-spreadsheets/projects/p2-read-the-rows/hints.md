`sheet.iter_rows(values_only=True)` gives you each row as a plain tuple. The
first one out is the header — and that is not a nuisance to be skipped past, it
is the thing you need to build the keys from.
---
`dict(zip(headers, row))` marries a tuple of names to a tuple of values in one
move. Take the header row first, then build one dictionary from each row that
follows.

For the blank cell, remember that `None or 0` is `0`.
---
```python
rows = list(sheet.iter_rows(values_only=True))
headers = rows[0]

records = []
for row in rows[1:]:
    record = dict(zip(headers, row))
    record['Units'] = record['Units'] or 0
    records.append(record)
```
