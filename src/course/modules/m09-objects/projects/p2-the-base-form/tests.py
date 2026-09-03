def test_base_enemy():
    """Enemy holds the shared behaviour"""
    Enemy = require("Enemy", "class")
    rat = Enemy("Rat", 5, 1)
    assert rat.name == "Rat" and rat.health == 5 and rat.damage == 1
    assert rat.describe() == "Rat (5 HP)", f"describe() gave {rat.describe()!r}"
    assert rat.attack() == 1
    assert rat.take_damage(3) == 2, "take_damage should return the new health."
    assert rat.is_alive() is True
    rat.take_damage(99)
    assert rat.health == 0 and rat.is_alive() is False
