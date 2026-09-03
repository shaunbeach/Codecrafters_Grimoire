Adding is one line if you use `.get()` with a default of 0 — that is the whole
point of the default.
---
Removing is three steps: refuse if the name is not there, subtract, and then
check whether the count has fallen to zero or below. If it has, `del` the entry.

For the report, `sorted(inventory)` gives you the keys in order — sorting a
dictionary sorts its keys.
---
```python
def add_item(inventory, name, quantity=1):
    inventory[name] = inventory.get(name, 0) + quantity
    return inventory


def remove_item(inventory, name, quantity=1):
    if name not in inventory:
        return False
    inventory[name] -= quantity
    if inventory[name] <= 0:
        del inventory[name]
    return True
```
