def test_returns_a_pair():
    """roll_attack returns two values"""
    roll_attack = require("roll_attack")
    result = roll_attack(10, 4)
    assert isinstance(result, tuple), (
        f"Expected a tuple like (damage, is_critical), got {type(result).__name__}: {result!r}"
    )
    assert len(result) == 2, f"Expected two values, got {len(result)}: {result!r}"
    damage, critical = result
    assert isinstance(damage, int), f"Damage should be an int, got {type(damage).__name__}."
    assert isinstance(critical, bool), (
        f"The second value should be True or False, got {critical!r}."
    )


def test_damage_is_power_minus_defence():
    """A normal hit does power - defence"""
    roll_attack = require("roll_attack")
    seen = {roll_attack(10, 4)[0] for _ in range(200)}
    assert seen <= {6, 12}, (
        f"Damage for power=10, defence=4 should be 6 normally or 12 on a crit, "
        f"but these values appeared: {sorted(seen)}"
    )
    assert 6 in seen, "A normal (non-critical) hit should do 6 damage."


def test_damage_floor():
    """Damage never drops below 1, however tough the target"""
    roll_attack = require("roll_attack")
    seen = {roll_attack(2, 50)[0] for _ in range(200)}
    assert min(seen) >= 1, (
        f"Damage bottomed out at {min(seen)}. Use max(1, ...) so a strong "
        "defence never heals the target."
    )
    assert seen <= {1, 2}, f"Expected only 1 or 2 (crit) damage, saw {sorted(seen)}"


def test_criticals_double_the_damage():
    """When is_critical is True the damage is doubled"""
    roll_attack = require("roll_attack")
    for _ in range(400):
        damage, critical = roll_attack(10, 4)
        if critical:
            assert damage == 12, f"A critical hit reported {damage} damage; expected 12."
        else:
            assert damage == 6, f"A normal hit reported {damage} damage; expected 6."


def test_critical_rate():
    """Criticals land roughly one time in five"""
    roll_attack = require("roll_attack")
    hits = sum(1 for _ in range(2000) if roll_attack(10, 4)[1])
    rate = hits / 2000
    assert 0.12 < rate < 0.28, (
        f"Criticals landed {rate:.0%} of the time over 2000 swings; the target "
        "is about 20%. Try `if random.random() < 0.2`."
    )


def test_battle_ends():
    """resolve_battle returns a sensible number of rounds"""
    resolve_battle = require("resolve_battle")
    rounds = resolve_battle(10, 4, 30)
    assert isinstance(rounds, int), f"Expected an int, got {type(rounds).__name__}."
    assert 3 <= rounds <= 5, (
        f"30 health against 6-12 damage per round should take 3 to 5 rounds, got {rounds}."
    )


def test_battle_with_weak_attacks():
    """Even a 1-damage attacker finishes eventually"""
    resolve_battle = require("resolve_battle")
    rounds = resolve_battle(1, 99, 10)
    assert 5 <= rounds <= 10, f"Expected between 5 and 10 rounds, got {rounds}."


def test_battle_uses_roll_attack():
    """resolve_battle delegates to roll_attack"""
    resolve_battle = require("resolve_battle")
    calls = []
    real = globals()["roll_attack"]
    globals()["roll_attack"] = lambda power, defence: (calls.append((power, defence)) or (5, False))
    try:
        resolve_battle(10, 4, 10)
    finally:
        globals()["roll_attack"] = real
    assert calls, "resolve_battle should call roll_attack rather than doing the maths again."
    assert calls[0] == (10, 4), f"roll_attack was called with {calls[0]}, expected (10, 4)."
