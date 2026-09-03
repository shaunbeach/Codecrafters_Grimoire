## The situation

The counting-house of the guild has two superstitions, and the ledger clerk has
gone home.

Thirteen is cursed and must never be added to a total — but the count carries on
past it. Zero is the void: when the clerk reaches one, the count ends there and
then, and nothing after it is looked at.

## What good looks like

```python
tally([1, 2, 3])            # 6
tally([1, 13, 2])           # 3      the 13 is skipped
tally([1, 2, 0, 99, 99])    # 3      the count stops at the 0
tally([13])                 # 0
tally([])                   # 0
```

## Your objective

**`tally(numbers)`** — return the total as an `int`.

- a `13` is skipped and adds nothing; counting continues
- a `0` ends the count immediately; nothing after it is added
- everything else is added up

## Watch out for

These are the two loop keywords that people learn and then never use. This is
what they are for.

`continue` abandons the current pass and goes back to the top. `break` leaves
the loop altogether. Write this with an `if` for each and the body stays flat —
write it with nested `else`s instead and you will see why the keywords exist.
