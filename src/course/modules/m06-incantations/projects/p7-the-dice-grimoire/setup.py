# Writes the `dice` module onto the virtual filesystem so `import dice` works
# exactly as it would if you had saved dice.py next to your own script.
import os, sys, importlib

DICE_SOURCE = '''"""A tiny dice-rolling module. Import it; do not edit it."""

import random

DEFAULT_SIDES = 6


def roll(sides=DEFAULT_SIDES):
    """Roll a single die and return the result (1 to sides)."""
    return random.randint(1, sides)


def roll_many(count, sides=DEFAULT_SIDES):
    """Roll `count` dice and return the results as a list."""
    return [roll(sides) for _ in range(count)]
'''

with open("dice.py", "w") as handle:
    handle.write(DICE_SOURCE)

if os.getcwd() not in sys.path:
    sys.path.insert(0, os.getcwd())

sys.modules.pop("dice", None)
importlib.invalidate_caches()
