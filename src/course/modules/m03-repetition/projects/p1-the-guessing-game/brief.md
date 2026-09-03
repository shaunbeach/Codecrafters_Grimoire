## The situation

The oracle in the cellar knows one number and will tell you nothing about it
except whether you are above or below. Apprentices have been shouting numbers at
it for years.

## What good looks like

```python
play_round(7, [3, 9, 7, 1])    # ['too low', 'too high', 'correct']
play_round(7, [1, 2])          # ['too low', 'too low', 'out of guesses']
play_round(7, [])              # ['out of guesses']
```

## Your objective

**`pick_secret(low, high)`** — return a random whole number between `low` and
`high`, **both ends included**.

**`play_round(secret, guesses)`** — walk the `guesses` list with a `while` loop
and return a list of hints:

| The guess is | Hint |
| --- | --- |
| below the secret | `'too low'` |
| above the secret | `'too high'` |
| equal | `'correct'` |

Stop as soon as you reach `'correct'` — later guesses are ignored. If the list
runs out without a correct guess, the last hint is `'out of guesses'`.

## Watch out for

Use a `while` here even though a `for` would also work. Walking a list by hand,
with an index you advance yourself, shows you exactly what `for` is doing on
your behalf — and you will meet the manual version again the moment a loop needs
to skip or rewind.

`random.randint(1, 6)` can return 6. Most range-like things in Python exclude
the top; this one does not.
