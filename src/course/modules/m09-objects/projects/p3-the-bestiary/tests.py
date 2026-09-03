def test_subclasses_are_enemies():
    """Every monster inherits from Enemy"""
    Enemy = require("Enemy", "class")
    for name in ["Goblin", "Dragon", "Slime"]:
        cls = require(name, "class")
        assert issubclass(cls, Enemy), f"class {name}(Enemy) — {name} does not inherit from Enemy."
        assert isinstance(cls(), Enemy), f"A {name} instance should also be an Enemy."


def test_subclass_stats():
    """Each monster sets its own name, health and damage"""
    expected = {"Goblin": ("Goblin", 20, 4), "Dragon": ("Dragon", 200, 30), "Slime": ("Slime", 10, 2)}
    for name, (label, health, damage) in expected.items():
        monster = require(name, "class")()
        assert monster.name == label, f"{name}.name is {monster.name!r}"
        assert monster.health == health, f"{name}.health is {monster.health}, expected {health}"
        assert monster.damage == damage, f"{name}.damage is {monster.damage}, expected {damage}"


def test_constructors_take_no_arguments():
    """Monsters know their own stats"""
    for name in ["Goblin", "Dragon", "Slime"]:
        cls = require(name, "class")
        try:
            cls()
        except TypeError as exc:
            raise AssertionError(
                f"{name}() failed: {exc}. The subclass __init__ should take only "
                "self and pass the stats up with super().__init__(...)."
            )


def test_describe_overrides():
    """Goblin and Dragon add their own flavour"""
    assert require("Goblin", "class")().describe() == "Goblin (20 HP) — small and vicious", (
        f"Got {require('Goblin', 'class')().describe()!r}"
    )
    assert require("Dragon", "class")().describe() == "Dragon (200 HP) — it breathes fire", (
        f"Got {require('Dragon', 'class')().describe()!r}"
    )


def test_slime_does_not_override_describe():
    """Slime is happy with the inherited description"""
    slime = require("Slime", "class")()
    assert slime.describe() == "Slime (10 HP)", (
        f"Got {slime.describe()!r} — Slime should inherit describe() unchanged."
    )


def test_describe_calls_super():
    """The flavour text is appended to the parent's version"""
    Enemy = require("Enemy", "class")
    original = Enemy.describe
    Enemy.describe = lambda self: "PATCHED"
    try:
        goblin_text = require("Goblin", "class")().describe()
    finally:
        Enemy.describe = original
    assert goblin_text == "PATCHED — small and vicious", (
        "Goblin.describe should call super().describe() and add to the result, "
        f"rather than rebuilding the string. Got {goblin_text!r}"
    )


def test_dragon_breathes_fire():
    """Dragon deals double damage"""
    dragon = require("Dragon", "class")()
    assert dragon.attack() == 60, f"Dragon().attack() gave {dragon.attack()}, expected 60."
    assert dragon.damage == 30, "The damage attribute itself should stay at 30."


def test_slime_is_squishy():
    """Slime halves incoming damage"""
    Slime = require("Slime", "class")
    slime = Slime()
    assert slime.take_damage(5) == 8, (
        f"A slime hit for 5 should take 2 damage (5 // 2) and be on 8 HP, got {slime.health}."
    )
    slime.take_damage(1)
    assert slime.health == 8, "A hit for 1 does 1 // 2 == 0 damage."


def test_polymorphism():
    """A mixed list of monsters can all be treated the same way"""
    monsters = [require(n, "class")() for n in ["Goblin", "Dragon", "Slime"]]
    total = sum(monster.attack() for monster in monsters)
    assert total == 66, f"4 + 60 + 2 should be 66, got {total}"
    for monster in monsters:
        assert isinstance(monster.describe(), str)
