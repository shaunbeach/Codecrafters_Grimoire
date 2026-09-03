## The situation

The roster comes out of a spreadsheet as CSV. The service that needs it speaks
only JSON. Somebody currently retypes it.

## What good looks like

`/data/roster.csv`:

```
name,level,town
Kira,7,Marrow Ford
Bo,3,Ashwell
Ana,12,Marrow Ford
```

```python
csv_to_json("/data/roster.csv", "/workspace/roster.json")
# 3
```

`roster.json`:

```json
[
  {"name": "Kira", "level": 7, "town": "Marrow Ford"},
  {"name": "Bo", "level": 3, "town": "Ashwell"},
  {"name": "Ana", "level": 12, "town": "Marrow Ford"}
]
```

## Your objective

**`csv_to_json(csv_path, json_path)`** — read the CSV, write a JSON array of one
object per row, and return the number of rows converted.

- `level` becomes a **number**; a level that will not convert becomes `0`
- everything else stays a string
- the JSON is written with `indent=2`

## Watch out for

Everything out of a CSV is a string, always. JSON knows the difference between
`7` and `"7"`, and the service at the other end will care — this conversion at
the boundary is the entire job.

Open both files with **`newline=""`**. Without it a field containing a line break
gets mangled on some platforms, intermittently, in a way that is genuinely hard
to trace.
