## The situation

Scrolls arrive from twelve different guildhouses, and every one of them fills in
the form differently. Some leave fields out. Some write ages as words. One sends
`null` because their scribe is a computer.

Your working sits between all of that and the rest of the system, and everything
downstream is entitled to assume the shape it gets back is correct.

This is the job of a **boundary**: the mess stops here.

## What good looks like

```python
read_scroll({"name": "Kira", "age": 30, "town": "Marrow Ford"})
# {'name': 'Kira', 'age': 30, 'town': 'Marrow Ford'}

read_scroll({"name": "Bo"})
# {'name': 'Bo', 'age': 0, 'town': 'unknown'}

read_scroll({"name": "Ana", "age": "not telling"})
# {'name': 'Ana', 'age': 0, 'town': 'unknown'}

read_scroll({"age": 30})
# {'name': 'anonymous', 'age': 30, 'town': 'unknown'}

read_scroll("not a scroll at all")
# {'name': 'anonymous', 'age': 0, 'town': 'unknown'}
```

## Your objective

**`read_scroll(record)`** — always return a dictionary with exactly the keys
`name`, `age` and `town`.

- `name` is a string; missing or blank becomes `'anonymous'`
- `age` is an `int`; missing or unconvertible becomes `0`; negative becomes `0`
- `town` is a string; missing or blank becomes `'unknown'`
- anything that is not a dictionary at all gives the all-defaults result

It must never raise, whatever it is handed.

## Watch out for

`"30"` as text should still become the number `30` — a guildhouse writing the
age in quotes is untidy, not wrong. `"not telling"` cannot become a number and
falls back to `0`.

`record.get(...)` on something that is not a dictionary raises `AttributeError`.
Check the type before you reach for the keys.
