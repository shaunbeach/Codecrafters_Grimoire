## The situation

**Step 2 of 2 — The Bestiary.**

`Enemy` is already in this file. Three creatures now, each mostly an Enemy and
slightly not.

## What good looks like

```python
Goblin().describe()      # 'Goblin (20 HP) — small and vicious'
Dragon().describe()      # 'Dragon (200 HP) — it breathes fire'
Slime().describe()       # 'Slime (10 HP)'          inherited unchanged
Dragon().attack()        # 60                        double its damage

slime = Slime()
slime.take_damage(5)     # 8    — 5 // 2 == 2 damage taken
```

## Your objective

Three subclasses, each taking **no arguments** and calling `super()`:

| Class | name | health | damage | Overrides |
| --- | --- | --- | --- | --- |
| `Goblin` | Goblin | 20 | 4 | `describe()` adds `' — small and vicious'` |
| `Dragon` | Dragon | 200 | 30 | `describe()` adds `' — it breathes fire'`, `attack()` doubles |
| `Slime` | Slime | 10 | 2 | `take_damage()` halves incoming damage first (`//`) |

The added text goes on the end of whatever the parent's `describe()` returned.
Build it with `super().describe()` — do not retype it.

## Watch out for

`Slime` overrides `take_damage` but not `describe`. Inheriting something
unchanged is a decision, not an omission.

`Dragon.damage` stays 30. It is `attack()` that doubles, not the attribute — the
dragon is not stronger, it breathes fire.
