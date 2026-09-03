Four outcomes means four branches. Write them in the order the doorman applies
them, not the order they appear in the table — the ID question comes before any
question about age.
---
`if not has_id:` handles the first rule on its own.

After that you are down to three age bands, and `elif` lets you test them from
the bottom up: under 18, then under 100, then everything else.

The years remaining is arithmetic, not a lookup: `18 - age`.
---
```python
if not has_id:
    return "No ID, no entry."
elif age < 18:
    return f"Come back in {18 - age} years."
elif age < 100:
    return "Welcome to the Rusty Tankard!"
else:
    return "Free ale for the elders!"
```
