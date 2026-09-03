## The situation

The carriers charge by weight. Last winter their booking working accepted a
parcel of minus four stone, returned a price of zero, and nobody noticed for
nine days — by which point the error was in the accounts, the invoices and two
separate arguments.

It should have refused at the door.

## What good looks like

```python
carriage_cost(0.5)      # 5.0
carriage_cost(1)        # 5.0
carriage_cost(2)        # 7.0
carriage_cost(10)       # 23.0

carriage_cost(0)        # ValueError: weight must be above zero, got 0
carriage_cost(-4)       # ValueError: weight must be above zero, got -4
carriage_cost("heavy")  # TypeError: weight must be a number, got str
```

## Your objective

**`carriage_cost(weight)`** — return the fare as a `float`:

- `5.0` base, which covers the first stone
- plus `2.0` for every **whole** stone above that, so part-stones round down —
  2.9 stone is charged as 2

And it must **refuse** rather than guess:

- a weight of zero or below raises `ValueError` with a message naming the value
- a weight that is not a number raises `TypeError` with a message naming the type

## Watch out for

Booleans are numbers in Python — `isinstance(True, int)` is `True`. That is
usually harmless and occasionally not; here, treat `True` as the mistake it is.

Put the value in the message. `"invalid weight"` sends somebody hunting through
your code; `"weight must be above zero, got -4"` ends the search.
