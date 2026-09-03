Walk the first roster. For each name, ask whether it is also in the second one.
Collect the ones that are.
---
Two conditions on whether to keep a name: it has to be in `b`, and it must not
already be in what you have collected — that second check is what prevents
duplicates.

Then `sorted(...)` on the way out.
---
```python
shared = []
for name in a:
    if name in b and name not in shared:
        shared.append(name)
return sorted(shared)
```

For comparison, the version you would actually write later:
`sorted(set(a) & set(b))`.
