Both workings modify `tasks` directly. Neither needs to build a new list.
---
For adding: two reasons to refuse, so one `if` with two conditions.
`description.strip()` is falsy when the text is blank or all spaces, and
`description not in tasks` handles the duplicate.

For completing: `if description in tasks:` then remove and return `True`; fall
through to `return False`.
---
```python
def add_task(tasks, description):
    if description.strip() and description not in tasks:
        tasks.append(description)
    return tasks


def complete_task(tasks, description):
    if description in tasks:
        tasks.remove(description)
        return True
    return False
```
