Fill in the plan first — actually decide, do not write placeholders. What are you
building? What would the files be called?
---
`new_game_state()` returns a dict literal. Because the literal is written inside
the working, a new one is built on every call, which is exactly what the
independence check is looking for.

`visited` starts as a list containing the starting room, so define the room name
once and use it twice.
---
```python
START_ROOM = "clearing"


def new_game_state():
    return {
        "room": START_ROOM,
        "inventory": [],
        "visited": [START_ROOM],
        "moves": 0,
    }


def look(state):
    """Describe the room the player is standing in. Returns a string."""
    raise NotImplementedError
```
