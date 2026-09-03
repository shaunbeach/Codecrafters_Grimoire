PROJECT_PLAN = {
    "name": "Hollow Wood",
    "goal": "A small text adventure you can wander, loot and save between sessions.",
    "files": ["main.py", "world.py", "player.py", "storage.py"],
    "milestones": [
        "State shape and stubs, so the whole program fits on one screen.",
        "World and Player classes, with look, move and take working end to end.",
        "Saving, loading and a command loop that never crashes on bad input.",
    ],
}

START_ROOM = "clearing"


def new_game_state():
    """Build a brand new game, unconnected to any other."""
    return {
        "room": START_ROOM,
        "inventory": [],
        "visited": [START_ROOM],
        "moves": 0,
    }


def look(state):
    """Describe the room the player is standing in. Returns a string."""
    raise NotImplementedError


def move(state, direction):
    """Move the player one room in `direction`. Returns a message."""
    raise NotImplementedError


def take(state, item):
    """Move `item` from the current room into the inventory. Returns a message."""
    raise NotImplementedError
