## The situation

The archivist keeps a running record. One line a day, added to the end, never
touching what came before.

Last year an apprentice wrote this working with `open(path, "w")` and erased
eleven years of it in a fifth of a second. There was no warning, because there
never is.

## What good looks like

```python
record("diary.txt", "found a door behind the shelves")
# 1

record("diary.txt", "the door is locked")
# 2
```

The file, afterwards:

```
- found a door behind the shelves
- the door is locked
```

## Your objective

**`record(path, entry)`** — append a line reading `- ` followed by the entry,
then return the total number of entries the file now holds, as an `int`.

- the file is created if it does not exist
- **everything already in it is preserved**
- blank entries are refused: change nothing and return the current count

## Watch out for

Mode `"a"` appends. Mode `"w"` empties the file the instant it opens. That one
letter is the whole exercise, and the check compares what was there before with
what is there afterwards.

Counting the entries means reading the file back — so this working both writes
and reads. Append first, then count.
