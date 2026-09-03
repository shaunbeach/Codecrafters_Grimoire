`pop(0)` removes and returns the first item. Guard it: an empty list is falsy,
so `if tasks:` is the whole check.
---
For the numbered copy, `enumerate(tasks, start=1)` hands you the position and
the task together, counting from 1.

Build a new list and append to it. Do not touch `tasks` — the check compares the
original before and after.
---
```python
def next_task(tasks):
    if tasks:
        return tasks.pop(0)
    return None


def pending_tasks(tasks):
    numbered = []
    for index, description in enumerate(tasks, start=1):
        numbered.append(f"{index}. {description}")
    return numbered
```
