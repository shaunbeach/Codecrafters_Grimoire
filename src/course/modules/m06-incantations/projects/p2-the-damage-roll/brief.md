## The situation

Combat needs two answers at once: how much damage was done, and whether it was a
critical hit. The tale is different depending on the second, so the caller needs
both.

## What good looks like

```python
roll_attack(10, 4)      # (6, False)   or  (12, True)
roll_attack(2, 50)      # (1, False)   or  (2, True)   — never less than 1

resolve_battle(10, 4, 30)   # 4 or 5, depending on the crits
```

## Your objective

**`roll_attack(power, defence)`** — return a `(damage, is_critical)` tuple.

- base damage is `power - defence`, but never below `1`
- a critical hit happens 20% of the time and **doubles** the damage
- the second value is `True` or `False`

**`resolve_battle(power, defence, health)`** — attack repeatedly until `health`
reaches zero or below, and return how many rounds it took. Use `roll_attack`; do
not work the damage out again.

## Watch out for

A defence higher than the power would otherwise produce negative damage — an
attack that heals its target. `max(1, ...)` is the guard, and clamping at the
source is always better than checking afterwards.

Because damage is guaranteed to be at least 1, the battle loop is guaranteed to
end. Whenever you write a `while`, be able to say what proves it stops.

`random.random() < 0.2` is true about a fifth of the time. Read it as "the
bottom fifth of the range" and it stops looking arbitrary.
