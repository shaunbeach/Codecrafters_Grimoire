## The situation

**Step 1 of 2 — The Ledger Tool.**

The quartermaster wants to stop opening the book by hand. She would like to type
things at it.

This step is the deciding: one typed line in, one answer out. Nothing about
loops or reading input — just the working that understands a command. Get this
right and the next step is eight lines.

## What good looks like

```python
store = {}
run_command(store, "set gold 50")      # 'gold = 50'
run_command(store, "add gold 20")      # 'gold = 70'
run_command(store, "get gold")         # 'gold = 70'
run_command(store, "del gold")         # 'deleted gold'
run_command(store, "get gold")         # 'no such key: gold'
run_command(store, "list")             # '(empty)'
run_command(store, "frobnicate x")     # 'unknown command: frobnicate'
run_command(store, "set gold fifty")   # 'bad arguments'
```

## Your objective

**`run_command(store, line)`** — carry out one command and return the response.

| Command | Effect | Response |
| --- | --- | --- |
| `set gold 50` | set the key to that number | `'gold = 50'` |
| `add gold 20` | add to it, starting from 0 if new | `'gold = 70'` |
| `get gold` | look it up | `'gold = 70'` or `'no such key: gold'` |
| `del gold` | delete it | `'deleted gold'` or `'no such key: gold'` |
| `list` | all keys, sorted, comma-separated | `'gold, rope'` or `'(empty)'` |

Anything else returns `'unknown command: <verb>'`. A wrong number of arguments,
a non-integer value, or an empty line returns `'bad arguments'`.

## Watch out for

Check the number of arguments **before** you index into them. `parts[1]` on a
one-word command raises `IndexError`, and a tool that dies on a typo is not a
tool.

`.split()` with no argument collapses runs of whitespace and drops the empties,
which handles `"  set   gold  50 "` without any effort on your part.

`int("fifty")` raises. Until you meet `try`/`except`, check first —
`"50".isdigit()` is `True` and `"fifty".isdigit()` is not.
