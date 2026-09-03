Two `return` statements in the first working — one for a critical, one for an
ordinary hit. Both hand back two values separated by a comma.
---
`return damage * 2, True` is already a tuple; the brackets are optional.

In the battle, unpack what comes back — `damage, _ = roll_attack(...)` — because
the loop does not care whether it was critical, only how much came off.
---
```python
def roll_attack(power, defence):
    damage = max(1, power - defence)
    if random.random() < 0.2:
        return damage * 2, True
    return damage, False


def resolve_battle(power, defence, health):
    rounds = 0
    while health > 0:
        damage, _ = roll_attack(power, defence)
        health -= damage
        rounds += 1
    return rounds
```
