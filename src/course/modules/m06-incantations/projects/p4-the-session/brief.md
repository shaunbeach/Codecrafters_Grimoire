## The situation

**Step 2 of 2 — The Ledger Tool.**

You have the working that understands one command. `run_command` is already in
this file, exactly as you left it — you do not need to write it again.

All that remains is to run a whole script of commands through it and report what
happened, which is the shape every command-line tool in the world has underneath.

## What good looks like

```python
run_session(["set gold 50", "add gold 20", "list"])
# ({'gold': 70}, ['gold = 50', 'gold = 70', 'gold'])
```

## Your objective

**`run_session(commands)`** — start from an **empty** dictionary, run every
command in order, and return a `(store, responses)` tuple: the book at the end,
and every answer along the way.

## Watch out for

Make the dictionary **inside** the working. If you make it at the top of the
file instead, every session shares one book and the second one starts with the
first one's contents — a bug that will not show up until you run twice.

That is the same trap as a mutable default argument, wearing a different hat.
