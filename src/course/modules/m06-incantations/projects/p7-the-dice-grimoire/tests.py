import dice


def _scripted(values):
    """Replace dice.roll with a fixed sequence so results are predictable."""
    supply = iter(values)
    return lambda sides=6: next(supply)


def test_module_is_imported():
    """Your file imports the dice module"""
    assert "dice" in globals(), (
        "I could not find `dice` in your file. Start with `import dice`."
    )


def test_stats_shape():
    """roll_stats returns rolls, total, highest and lowest"""
    roll_stats = require("roll_stats")
    result = roll_stats(3, 6)
    assert isinstance(result, dict), f"Expected a dict, got {type(result).__name__}."
    assert set(result) == {"rolls", "total", "highest", "lowest"}, (
        f"Expected the keys rolls/total/highest/lowest, got {sorted(result)}"
    )
    assert len(result["rolls"]) == 3, f"Asked for 3 dice, got {len(result['rolls'])}."


def test_stats_maths():
    """The summary matches the dice that were rolled"""
    roll_stats = require("roll_stats")
    original = dice.roll
    dice.roll = _scripted([3, 1, 6])
    try:
        result = roll_stats(3, 6)
    finally:
        dice.roll = original
    assert result["rolls"] == [3, 1, 6], (
        f"Expected the rolls [3, 1, 6] from the dice module, got {result['rolls']}. "
        "Use dice.roll_many rather than rolling your own."
    )
    assert result["total"] == 10, f"total should be 10, got {result['total']}"
    assert result["highest"] == 6, f"highest should be 6, got {result['highest']}"
    assert result["lowest"] == 1, f"lowest should be 1, got {result['lowest']}"


def test_stats_respect_sides():
    """Rolls stay within the range of the die"""
    roll_stats = require("roll_stats")
    for _ in range(50):
        rolls = roll_stats(5, 20)["rolls"]
        assert all(1 <= value <= 20 for value in rolls), (
            f"A 20-sided die produced {rolls}. Pass `sides` through to the dice module."
        )


def test_best_of_drops_the_lowest():
    """best_of ignores the worst die"""
    best_of = require("best_of")
    original = dice.roll
    dice.roll = _scripted([4, 2, 6, 5])
    try:
        result = best_of(4, 6)
    finally:
        dice.roll = original
    assert result == 15, (
        f"Rolling 4, 2, 6, 5 and dropping the 2 should give 15, got {result}."
    )


def test_best_of_single_die():
    """A single die has nothing to drop"""
    best_of = require("best_of")
    original = dice.roll
    dice.roll = _scripted([4])
    try:
        result = best_of(1, 6)
    finally:
        dice.roll = original
    assert result == 4, f"best_of(1, 6) after rolling a 4 should be 4, got {result}."


def test_no_direct_randint():
    """The dice module does the rolling, not random.randint"""
    best_of = require("best_of")
    roll_stats = require("roll_stats")
    original = dice.roll
    dice.roll = _scripted([1] * 20)
    try:
        stats = roll_stats(3, 6)
        best = best_of(3, 6)
    finally:
        dice.roll = original
    assert stats["rolls"] == [1, 1, 1] and best == 2, (
        "Your functions still produced their own random numbers. Route every "
        "roll through dice.roll / dice.roll_many."
    )
