## The situation

Somebody has already written the dice. There is a file called `dice.py` sitting
beside yours, and it does the rolling perfectly well.

Your job is not to roll dice. It is to build on work you did not do — which is
most of what programming actually is.

```python
DEFAULT_SIDES = 6
roll(sides=6)              # one die, 1 to sides
roll_many(count, sides=6)  # a list of results
```

## What good looks like

```python
roll_stats(3, 6)
# {'rolls': [3, 1, 6], 'total': 10, 'highest': 6, 'lowest': 1}

best_of(4, 6)
# the sum of the best three of four dice
```

## Your objective

**`roll_stats(count, sides)`** — roll `count` dice and return a dict with
`rolls`, `total`, `highest` and `lowest`.

**`best_of(count, sides)`** — roll `count` dice, discard the single lowest, and
return the sum of the rest. With one die there is nothing to discard, so return
it as it is. (This is how tabletop games roll a good statistic: four dice, drop
the worst.)

## Watch out for

Do not call `random.randint` yourself. Every roll goes through the `dice` module
— that is the entire point, and the checks verify it by replacing the module's
dice with loaded ones and seeing whether your numbers follow.

`import dice` at the top, then `dice.roll_many(...)`. The dot is what keeps
their `roll` and any `roll` of your own from colliding.
