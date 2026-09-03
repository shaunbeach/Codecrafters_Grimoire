## The situation

The guild has been keeping characters in dictionaries, and last month somebody
wrote `character["helth"] = 50`. Python created a new key, said nothing, and the
character quietly became immortal.

Make it an object. Give it rules it enforces itself.

## What good looks like

```python
kira = Character("Kira", 100, 15)
goblin = Character("Goblin", 30, 5)

kira.attack(goblin)     # 15
str(goblin)             # 'Goblin: 15/30 HP'
goblin.is_alive()       # True
```

## Your objective

**`Character(name, health=100, strength=10)`** — store `name`, `health`,
`strength`, and a `max_health` that starts equal to `health`.

- **`is_alive()`** — `True` while health is above 0
- **`take_damage(amount)`** — lower health, never below 0; return the new health
- **`heal(amount)`** — raise health, never above `max_health`; return the new
  health. A dead character cannot be healed
- **`attack(other)`** — deal `self.strength` damage by calling
  `other.take_damage(...)`; return the damage dealt. A dead attacker deals 0 and
  must not touch the target
- **`__str__()`** — `'Kira: 70/100 HP'`

## Watch out for

`attack` must not reach into `other.health` and subtract. Ask the other
character to take damage and let it apply its own floor — that is what "an
object owns its state" means in practice.

Store the attributes on `self` inside `__init__`. Putting them in the class body
instead makes them shared by every character in the game.
