## The situation

**Step 1 of 3 — The Trial.**

Three workings from the end, and you write no logic at all today.

You decide what the thing *is*. What data it holds, what files it lives in, and
what order you will build it in. This is the part people skip, and it is the
part that decides whether the next two steps are pleasant or miserable.

## What good looks like

```python
PROJECT_PLAN["name"]         # 'Hollow Wood'
new_game_state()
# {'room': 'clearing', 'inventory': [], 'visited': ['clearing'], 'moves': 0}

look(new_game_state())       # NotImplementedError
```

## Your objective

**`PROJECT_PLAN`** — a dict with exactly these keys:

| Key | Value |
| --- | --- |
| `name` | your project's name, a non-empty string |
| `goal` | one sentence, at least 30 characters |
| `files` | at least 3 filenames, each ending in `.py` |
| `milestones` | at least 3 non-empty strings, in build order |

**`new_game_state()`** — return a **fresh** dict each call, with exactly `room`
(a non-empty string), `inventory` (empty list), `visited` (a list holding the
starting room) and `moves` (`0`).

**`look(state)`**, **`move(state, direction)`**, **`take(state, item)`** — stubs.
Each needs a docstring saying what it will do, and a body that raises
`NotImplementedError`.

## Watch out for

The project is yours. The checks test the *shape* of your plan, not its content
— name it whatever you like.

`raise NotImplementedError`, not `pass`. A stub that returns `None` silently
produces a confusing failure three workings away; one that raises tells you
exactly where you are.

`new_game_state()` must build the dict **inside** the working. Return a
module-level one and every game shares it.
