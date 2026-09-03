## The situation

There is a board by the guild door where jobs get chalked up and rubbed off
again. Twice this month somebody has chalked the same job up three times, and
once a job was rubbed off that was never there, which caused an argument.

## What good looks like

```python
chores = []
add_task(chores, "buy rope")
add_task(chores, "buy rope")     # already up there; ignored
add_task(chores, "   ")          # nothing was written; ignored
chores
# ['buy rope']

complete_task(chores, "buy rope")      # True
complete_task(chores, "slay dragon")   # False — it was never up
```

## Your objective

**`add_task(tasks, description)`** — add the description to the end of the list.
Ignore it if it is blank or only whitespace, or already on the board. Return the
list.

**`complete_task(tasks, description)`** — remove that task. Return `True` if it
was there, `False` if it was not. It must never raise.

## Watch out for

Both of these change the list they are **given**. They do not make a new one and
hand it back — the board on the wall is the board on the wall.

`.remove()` raises `ValueError` when the value is not present. Check with `in`
first, and the second working becomes three short lines.
