## The situation

The game needs to remember where you were. Not in a format you invented — in
one that any machine, in any language, can read back without being told
anything.

## What good looks like

```python
save_state("save.json", {"room": "clearing", "inventory": ["rope"], "moves": 3})
load_state("save.json")
# {'room': 'clearing', 'inventory': ['rope'], 'moves': 3}

load_state("nothing.json")     # {}     no save yet
load_state("corrupt.json")     # {}     half-written by a crash
```

The file itself, readable by a person:

```json
{
  "inventory": [
    "rope"
  ],
  "moves": 3,
  "room": "clearing"
}
```

## Your objective

**`save_state(path, state)`** — write it as JSON with `indent=2` and
`sort_keys=True`.

**`load_state(path)`** — read it back. Return `{}` if the file is missing, is
not valid JSON, **or parses to something that is not a dictionary**.

## Watch out for

Three failures, not two. A missing file, a half-written one, and — the one
people forget — a file containing `null`, which is perfectly valid JSON and
parses to `None`. It then flows onward looking like data until something much
further away breaks.

`sort_keys=True` makes the same state produce byte-identical output every time,
which is what lets a save file live in version control and be compared.
