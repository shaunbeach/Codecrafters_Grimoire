Each subclass needs an `__init__` that takes only `self` and passes the stats up
with `super().__init__(...)`. Do all three of those first and check the stats
before overriding anything.
---
`super().describe()` gives you the parent's string; add to it with `+`.

`super().attack() * 2` is the fire breath.

For the slime, override `take_damage(self, amount)` and pass a smaller number
up: `super().take_damage(amount // 2)`.
---
```python
class Goblin(Enemy):
    def __init__(self):
        super().__init__("Goblin", 20, 4)

    def describe(self):
        return super().describe() + " — small and vicious"


class Slime(Enemy):
    def __init__(self):
        super().__init__("Slime", 10, 2)

    def take_damage(self, amount):
        return super().take_damage(amount // 2)
```
