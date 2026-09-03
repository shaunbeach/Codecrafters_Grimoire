Split the line into parts and get the empty case out of the way first. After
that, the verb is `parts[0]` and everything else is `parts[1:]`.
---
Group the commands by shape rather than writing five separate branches: `set`
and `add` both take a name and a number; `get` and `del` both take just a name;
`list` takes nothing.

Validate each group once — the right number of arguments, and for `set`/`add`
that the value really is a number.
---
```python
parts = line.split()
if not parts:
    return "bad arguments"

verb, arguments = parts[0], parts[1:]

if verb in ("set", "add"):
    if len(arguments) != 2 or not arguments[1].lstrip("-").isdigit():
        return "bad arguments"
    name, value = arguments[0], int(arguments[1])
    if verb == "add":
        value += store.get(name, 0)
    store[name] = value
    return f"{name} = {store[name]}"
```

`get` and `del` follow the same pattern, and `unknown command` is the fall
through at the bottom.
