Four short methods and an `__init__`. This is the same shape as the character
sheet, with fewer rules.
---
`describe` is an f-string: the name, a space, then the health in brackets
followed by ` HP`.

`take_damage` uses the same `max(0, ...)` floor you have already written once.
---
```python
class Enemy:
    def __init__(self, name, health, damage):
        self.name = name
        self.health = health
        self.damage = damage

    def describe(self):
        return f"{self.name} ({self.health} HP)"

    def attack(self):
        return self.damage
```
