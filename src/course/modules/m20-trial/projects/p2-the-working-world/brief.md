## The situation

**Step 2 of 3 — The Trial.**

The plan is drawn. Build it.

A module `world_data.py` sits beside your file with the map in it — rooms, what
connects them, what is lying about. Plain data, no logic:

```python
ROOMS = {
    "clearing": {
        "description": "A quiet clearing ringed by white birch trees.",
        "exits": {"north": "cave", "east": "cottage"},
        "items": ["rope"],
    },
    ...
}
```

## What good looks like

```python
player = Player(World(ROOMS), "clearing")

player.look()
# A quiet clearing ringed by white birch trees.
# Exits: east, north
# You can see: rope

player.take("rope")     # 'You take the rope.'
player.move("north")    # 'You go north.'
player.move("west")     # 'You cannot go that way.'
```

## Your objective

**`World(rooms)`** — takes its rooms as an argument.

- `describe(room)`, `exits(room)` (**sorted**), `destination(room, direction)`
  (or `None`), `items(room)` — returning the room's actual list

**`Player(world, start)`** — attributes `world`, `room`, `inventory`, `moves`.

- `look()` — description, then `Exits: east, north`, then `You can see: rope`
  (that last line only when there are items, sorted and comma-separated)
- `move(direction)` — `'You go north.'`, updating `room` and `moves`. An
  impossible direction returns `'You cannot go that way.'` and changes nothing
- `take(item)` — `'You take the rope.'`, moving it from the room to the
  inventory; otherwise `'There is no sword here.'`
- `inventory_list()` — a **sorted copy**

## Watch out for

`World` takes `rooms` rather than importing them. A class that fetches its own
data can only ever be used one way, and cannot be handed a small fake map by a
test.

`items()` returns the room's real list, so `take` removing from it changes the
world. Earlier that aliasing was a hazard; here it is the mechanism — and the
difference is that it is deliberate and written down.

A failed move must not cost a move.
