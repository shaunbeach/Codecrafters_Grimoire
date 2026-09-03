def test_children_cross_free():
    """Under twelve pays nothing"""
    toll = require("toll")
    assert toll(8, False) == 0.0, f"Got {toll(8, False)!r}"
    assert toll(11, False) == 0.0


def test_the_standard_fare():
    """Twelve to sixty-four pays full price"""
    toll = require("toll")
    assert toll(30, False) == 5.0, f"Got {toll(30, False)!r}"
    assert toll(12, False) == 5.0, (
        f"Twelve gave {toll(12, False)!r}. The child band is *under* twelve."
    )
    assert toll(64, False) == 5.0


def test_the_elder_fare():
    """Sixty-five and over pays less"""
    toll = require("toll")
    assert toll(65, False) == 2.5, (
        f"Sixty-five gave {toll(65, False)!r} — the elder band starts at 65, not 66."
    )
    assert toll(90, False) == 2.5


def test_the_guild_discount():
    """Members keep four fifths of the fare"""
    toll = require("toll")
    assert toll(30, True) == 4.0, f"Got {toll(30, True)!r} — 20% off 5.0 is 4.0."
    assert toll(70, True) == 2.0, f"Got {toll(70, True)!r} — 20% off 2.5 is 2.0."


def test_free_stays_free():
    """A discount on nothing is still nothing"""
    toll = require("toll")
    assert toll(8, True) == 0.0, f"Got {toll(8, True)!r}"


def test_returns_a_number():
    """The fare is a number, not a string"""
    toll = require("toll")
    assert isinstance(toll(30, False), float), (
        f"Expected a float, got {type(toll(30, False)).__name__}."
    )
