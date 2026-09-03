Start with `__init__` and the four attributes. Make two characters and print
their healths before writing a single method — if changing one changes the
other, the attributes are in the wrong place.
---
`max(0, self.health - amount)` is the damage floor; `min(self.max_health, ...)`
is the healing ceiling. Both methods return the new health.

`attack` has a guard at the top (`if not self.is_alive(): return 0`) and then
calls `other.take_damage(self.strength)`.
---
```python
def take_damage(self, amount):
    self.health = max(0, self.health - amount)
    return self.health

def heal(self, amount):
    if not self.is_alive():
        return self.health
    self.health = min(self.max_health, self.health + amount)
    return self.health

def attack(self, other):
    if not self.is_alive():
        return 0
    other.take_damage(self.strength)
    return self.strength
```
