# The Exchange

Two machines that have never met, written by people who will never speak, in
languages that share nothing — and they need to agree on what a customer is.

**JSON** is how the world settled that argument. It is the closest thing
computing has to a common tongue, and it is small enough to learn in a page.

## It is dicts and lists

```json
{
  "name": "Kira",
  "level": 7,
  "alive": true,
  "guild": null,
  "carried": ["rope", "lantern"]
}
```

| JSON | Python |
| --- | --- |
| object | `dict` |
| array | `list` |
| string | `str` |
| number | `int` / `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

That is the whole mapping. There is nothing else in JSON — which is exactly why
everything can read it.

## Four functions

```python
import json

json.dump(data, handle)      # write to an open file
data = json.load(handle)     # read from an open file

text = json.dumps(data)      # to a string
data = json.loads(text)      # from a string
```

The `s` is for **string**. `dump`/`load` work with files; `dumps`/`loads` work
with text. Reaching for the wrong pair is the most common confusion here, and
the error message when you do is unhelpful.

```python
with open("save.json", "w") as handle:
    json.dump(state, handle, indent=2)
```

`indent=2` makes the file readable and diffable, which matters the first time
somebody has to review a change to it. `sort_keys=True` makes it deterministic —
the same data always producing the same bytes.

## What it cannot carry

JSON handles dicts, lists, strings, numbers, booleans and `None`. It does not
handle sets, dates, tuples-as-tuples (they come back as lists), or your own
classes.

```python
json.dumps({"when": datetime.now()})     # TypeError: not JSON serializable
```

Convert on the way out and back on the way in. This is not a limitation to work
around — it is the format refusing to guess what another language should do with
a Python object, which is precisely why it is portable.

## Reading it is not trusting it

```python
try:
    data = json.loads(text)
except json.JSONDecodeError:
    return default
```

`JSONDecodeError` is a subclass of `ValueError`, so catching either works.

And a file that parses is not a file that is correct. `null` is valid JSON and
becomes `None`, which then flows into your programme looking like data. Check
the shape as well as the syntax:

```python
if not isinstance(data, dict) or "name" not in data:
    return default
```

## Moving between shapes

Most real work is not reading one format. It is reading one and writing another
— a CSV export becoming a JSON payload, a JSON response becoming a spreadsheet
row.

```python
import csv

with open("people.csv", newline="") as handle:
    rows = list(csv.DictReader(handle))
```

`csv.DictReader` does what you built by hand in Act Two: it reads the header and
hands you a dict per row. Having written it yourself, you now know exactly what
it is doing, and can use it without mystery.

**`newline=""`** is not optional. Without it, a field containing a line break
gets mangled on some platforms — a quiet, intermittent corruption that is
genuinely difficult to track down.

```python
with open("people.csv", "w", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=["name", "level"])
    writer.writeheader()
    writer.writerows(rows)
```

Everything out of a CSV is a **string**, always. JSON knows the difference
between `7` and `"7"`; CSV does not. Converting at the boundary is your job, and
forgetting it is how a total ends up being `"77"` instead of `14`.

## Reaching into the deep

Real payloads nest. Four levels down is ordinary:

```python
data["results"][0]["address"]["city"]
```

Every bracket is a `KeyError` or an `IndexError` waiting for the week the
service changes. When you are digging into something you do not control, dig
carefully — and decide, at each level, whether a missing piece is a default or a
genuine failure.
