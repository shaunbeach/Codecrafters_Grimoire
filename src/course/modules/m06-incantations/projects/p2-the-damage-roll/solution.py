import random

CRITICAL_CHANCE = 0.2


def roll_attack(power, defence):
    """Return (damage, is_critical) for one swing."""
    damage = max(1, power - defence)
    if random.random() < CRITICAL_CHANCE:
        return damage * 2, True
    return damage, False


def resolve_battle(power, defence, health):
    """Attack until health runs out, and report how many rounds it took."""
    rounds = 0
    while health > 0:
        damage, _ = roll_attack(power, defence)
        health -= damage
        rounds += 1
    return rounds
