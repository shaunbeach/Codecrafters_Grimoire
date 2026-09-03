Two halves: add the line, then count what is in the file. Do them in that order
and the count comes out right without any arithmetic.
---
`open(path, "a")` creates the file if needed and puts you at the end of it.
Remember the `\n`.

For the count, open again for reading and count the non-blank lines. A missing
file at that point cannot happen — you just appended to it — but a refused blank
entry means you may be counting a file that was never created, so guard it.
---
```python
if not entry.strip():
    try:
        with open(path) as handle:
            return len([l for l in handle if l.strip()])
    except FileNotFoundError:
        return 0

with open(path, "a") as handle:
    handle.write(f"- {entry}\n")

with open(path) as handle:
    return len([line for line in handle if line.strip()])
```
