# Writes world_data.py beside your file. Import it; do not edit it.
import copy, os, sys, importlib

WORLD_SOURCE = '''"""The map. Rooms, what connects them, and what is lying around."""

ROOMS = {
    "clearing": {
        "description": "A quiet clearing ringed by white birch trees.",
        "exits": {"north": "cave", "east": "cottage"},
        "items": ["rope"],
    },
    "cave": {
        "description": "A damp cave. Something drips in the dark.",
        "exits": {"south": "clearing"},
        "items": ["lantern", "coin"],
    },
    "cottage": {
        "description": "A tidy cottage with a cold hearth.",
        "exits": {"west": "clearing"},
        "items": [],
    },
}
'''

with open("world_data.py", "w") as handle:
    handle.write(WORLD_SOURCE)

if os.getcwd() not in sys.path:
    sys.path.insert(0, os.getcwd())

sys.modules.pop("world_data", None)
importlib.invalidate_caches()

import world_data


def fresh_rooms():
    """An untouched copy of the map, so one test cannot spoil the next."""
    return copy.deepcopy(world_data.ROOMS)
