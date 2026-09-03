## The situation

**Step 1 of 2 — The Bestiary.**

Before there are goblins there is the idea of a monster: something with a name,
some health, and a way of hurting you. Get that right once and every creature
after it is four lines.

## What good looks like

```python
rat = Enemy("Rat", 5, 1)

rat.describe()      # 'Rat (5 HP)'
rat.attack()        # 1
rat.take_damage(3)  # 2
rat.is_alive()      # True
rat.take_damage(99)
rat.is_alive()      # False
```

## Your objective

**`Enemy(name, health, damage)`** — attributes `name`, `health`, `damage`.

- **`describe()`** — `'Goblin (20 HP)'`
- **`attack()`** — return `self.damage`
- **`take_damage(amount)`** — lower health, floored at 0; return the new health
- **`is_alive()`** — `True` while health is above 0

## Watch out for

Nothing here is new after the character sheet. That is deliberate: this is the
piece three other classes are about to depend on, so it is worth being sure of
before you build on it.

The description format is exact. Every subclass will append to it.
