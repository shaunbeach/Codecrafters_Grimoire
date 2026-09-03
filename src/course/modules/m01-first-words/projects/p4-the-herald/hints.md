Two answers, so two `return` statements. Deal with the empty name first — an
empty string is falsy, so `if not name:` is the whole test.
---
`name.upper()` gives you the shouting. `len(name)` gives you the count. An
f-string lets you drop both into one sentence without gluing pieces together
with `+`.
---
```python
if not name:
    return "Make way for a stranger with no name."
return f"Make way for {name.upper()}, whose name is {len(name)} letters long."
```
