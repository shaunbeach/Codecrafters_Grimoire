An accumulator you have written several times now: an empty list before the
loop, one append inside it, return after. The only new part is that two things
come back instead of one.
---
`run_command` is already defined for you. Call it — do not reimplement it.

`return store, responses` hands back a tuple of both.
---
```python
def run_session(commands):
    store = {}
    responses = []
    for line in commands:
        responses.append(run_command(store, line))
    return store, responses
```

The dictionary is created on the first line of the working, which is exactly why
each session starts clean.
