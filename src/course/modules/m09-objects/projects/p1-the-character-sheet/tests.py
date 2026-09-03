def test_attributes():
    """A new character remembers its name, health and strength"""
    Character = require("Character", "class")
    kira = Character("Kira", 100, 15)
    assert kira.name == "Kira", f"name is {kira.name!r}"
    assert kira.health == 100, f"health is {kira.health!r}"
    assert kira.strength == 15, f"strength is {kira.strength!r}"
    assert kira.max_health == 100, (
        f"max_health is {getattr(kira, 'max_health', None)!r} — it should start "
        "equal to the health it was created with."
    )


def test_defaults():
    """health and strength have defaults"""
    Character = require("Character", "class")
    try:
        plain = Character("Plain")
    except TypeError as exc:
        raise AssertionError(f"Character('Plain') failed: {exc}. Give the parameters defaults.")
    assert plain.health == 100 and plain.strength == 10, (
        f"Expected 100 health and 10 strength by default, got {plain.health} and {plain.strength}."
    )


def test_instances_are_independent():
    """Two characters do not share state"""
    Character = require("Character", "class")
    a = Character("A", 50)
    b = Character("B", 50)
    a.take_damage(10)
    assert b.health == 50, (
        f"Damaging A changed B's health to {b.health}. Store values on self "
        "inside __init__, not on the class body."
    )


def test_take_damage_floors_at_zero():
    """Health never goes negative"""
    Character = require("Character", "class")
    goblin = Character("Goblin", 30, 5)
    assert goblin.take_damage(10) == 20, "take_damage should return the new health."
    goblin.take_damage(999)
    assert goblin.health == 0, f"Health bottomed out at {goblin.health}; use max(0, ...)."


def test_is_alive():
    """is_alive tracks health"""
    Character = require("Character", "class")
    goblin = Character("Goblin", 30)
    assert goblin.is_alive() is True
    goblin.take_damage(30)
    assert goblin.is_alive() is False, "A character on 0 HP is not alive."


def test_heal_caps_at_max():
    """Healing never exceeds max_health"""
    Character = require("Character", "class")
    kira = Character("Kira", 100)
    kira.take_damage(40)
    assert kira.heal(10) == 70, "heal should return the new health."
    kira.heal(999)
    assert kira.health == 100, f"Health overshot to {kira.health}; use min(self.max_health, ...)."


def test_dead_characters_stay_dead():
    """Healing a corpse does nothing"""
    Character = require("Character", "class")
    goblin = Character("Goblin", 10)
    goblin.take_damage(10)
    goblin.heal(50)
    assert goblin.health == 0, f"A dead character was healed back to {goblin.health}."


def test_attack_damages_the_target():
    """attack routes damage through the other character"""
    Character = require("Character", "class")
    kira = Character("Kira", 100, 15)
    goblin = Character("Goblin", 30, 5)
    dealt = kira.attack(goblin)
    assert dealt == 15, f"attack should return the damage dealt, got {dealt!r}"
    assert goblin.health == 15, f"The goblin should be on 15 HP, it is on {goblin.health}."
    assert kira.health == 100, "The attacker should not lose health."


def test_dead_characters_cannot_attack():
    """A dead attacker deals nothing"""
    Character = require("Character", "class")
    kira = Character("Kira", 10, 15)
    goblin = Character("Goblin", 30, 5)
    kira.take_damage(10)
    assert kira.attack(goblin) == 0, "A dead character's attack should return 0."
    assert goblin.health == 30, f"The goblin was hurt by a dead attacker; it is on {goblin.health}."


def test_str():
    """print(character) is readable"""
    Character = require("Character", "class")
    kira = Character("Kira", 100, 15)
    kira.take_damage(30)
    assert str(kira) == "Kira: 70/100 HP", (
        f"str(character) gave {str(kira)!r}; expected 'Kira: 70/100 HP'. "
        "Define __str__ on the class."
    )
