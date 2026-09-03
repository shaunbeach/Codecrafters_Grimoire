## The situation

The board is full. Somebody has to decide what is actually next, and somebody
else wants a tidy numbered copy to carry around — without the original getting
scribbled on.

## What good looks like

```python
chores = ["buy rope", "oil the hinge"]

pending_tasks(chores)
# ['1. buy rope', '2. oil the hinge']
chores
# ['buy rope', 'oil the hinge']      unchanged

next_task(chores)
# 'buy rope'
chores
# ['oil the hinge']                  changed

next_task([])
# None
```

## Your objective

**`next_task(tasks)`** — remove **and return** the first task. Return `None` if
the board is empty.

**`pending_tasks(tasks)`** — return a new list of numbered strings, counting
from 1, leaving the original list exactly as it was.

## Watch out for

These two are opposites, deliberately. One takes something out of the list; the
other must not touch it at all. Getting a *copy* where you wanted the original —
or the original where you wanted a copy — is the most common list bug there is.

`.pop(0)` on an empty list raises `IndexError`.
