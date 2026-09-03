## The situation

The payload from the far oracle is four levels deep, and every level is a
bracket that will raise on the week they change something.

```python
data["results"][0]["address"]["city"]
```

Write the working that digs safely, once, so that nothing else ever has to write
that line again.

## What good looks like

```python
data = {"results": [{"address": {"city": "Marrow Ford"}}], "count": 1}

dig(data, ["results", 0, "address", "city"])     # 'Marrow Ford'
dig(data, ["count"])                             # 1
dig(data, ["results", 9, "address"])             # None
dig(data, ["results", 0, "phone"])               # None
dig(data, ["results", 0, "phone"], "unlisted")   # 'unlisted'
dig(None, ["anything"])                          # None
```

## Your objective

**`dig(data, path, default=None)`** — follow `path` into nested data and return
what you find, or `default` if any step of the way is missing.

- a string step indexes a dictionary
- an integer step indexes a list
- a wrong type, a missing key, or a position past the end all give `default`
- an empty path returns `data` itself

It must never raise.

## Watch out for

Take one step at a time, checking as you go. Trying to be clever with one long
expression and a single `try` around it works, but it cannot tell you *where* it
gave up — and when you are debugging a payload that changed shape overnight,
that is the only thing you want to know.

`True` is an `int` in Python, and `data[True]` on a list means `data[1]`. Worth
knowing exists; not worth guarding here.
