## The situation

The quartermaster keeps everything in one book: what there is, and how much of
it. She has two rules she is firm about. You may not take what was never there,
and the book must never say `rope: 0` — if there is no rope, the line comes out.

## What good looks like

```python
bag = {}
add_item(bag, "gold", 50)
add_item(bag, "gold", 25)
bag                          # {'gold': 75}

remove_item(bag, "gold", 100)
bag                          # {}      the line is gone, not zeroed

remove_item(bag, "sword")    # False   never had one

inventory_report({"gold": 50, "health_potion": 3})
# ['gold x50', 'health_potion x3']
```

## Your objective

**`add_item(inventory, name, quantity=1)`** — increase the count, creating the
entry if it is new. Return the inventory.

**`remove_item(inventory, name, quantity=1)`** — decrease the count. If it
reaches zero or below, delete the entry entirely. Return `True` if anything was
removed, `False` if the item was never there.

**`inventory_report(inventory)`** — return a list of strings sorted
alphabetically by item name.

## Watch out for

`inventory.get(name, 0) + quantity` handles both the new entry and the existing
one in a single line, with no `if` at all.

Removing an item you do not have must not raise. Ask before you reach.
