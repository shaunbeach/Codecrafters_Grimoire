## The situation

The night watch keeps a log. It is nine thousand lines long, most of it is
`INFO: all quiet`, and the captain wants to know how many times something
actually went wrong.

```
INFO: watch begins
WARN: gate left unbarred
ERROR: torch out on the east wall
INFO: all quiet
ERROR: sighting in the treeline
```

## What good looks like

```python
count_level("/data/watch.log", "ERROR")     # 2
count_level("/data/watch.log", "INFO")      # 2
count_level("/data/watch.log", "FATAL")     # 0
count_level("/data/missing.log", "ERROR")   # 0
```

## Your objective

**`count_level(path, level)`** — return how many lines begin with that level
followed by a colon, as an `int`.

- a missing file counts as `0`; the watch simply has not written tonight
- blank lines are not entries
- the match is exact: `ERROR` does not count `ERRORLOG`

## Watch out for

Loop over the file itself rather than reading it whole. On nine thousand lines
it makes no difference; on nine million it is the difference between working and
not, and the habit costs nothing to form now.

`line.startswith("ERROR:")` — with the colon — is what makes the match exact.
Without it, a level of `ERR` would match `ERROR` lines too.
