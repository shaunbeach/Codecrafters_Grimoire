def test_holds_coins():
    """A purse remembers what it holds"""
    Purse = require("Purse", "class")
    purse = Purse(50)
    assert purse.balance == 50, f"balance is {purse.balance!r}"
    assert Purse().balance == 0, "A purse with no starting balance holds nothing."


def test_adding_and_spending():
    """Both report the new balance"""
    Purse = require("Purse", "class")
    purse = Purse(50)
    assert purse.add(25) == 75, f"add returned {purse.add(25)!r}"
    assert purse.spend(30) == 45, "spend should return the new balance."


def test_purses_are_independent():
    """Two purses do not share coins"""
    Purse = require("Purse", "class")
    a, b = Purse(10), Purse(10)
    a.add(90)
    assert b.balance == 10, (
        f"Adding to one purse changed another, which now holds {b.balance}. "
        "Set the balance on self inside __init__."
    )


def test_cannot_start_negative():
    """A purse cannot be created owing money"""
    Purse = require("Purse", "class")
    try:
        Purse(-1)
    except ValueError as exc:
        assert "-1" in str(exc), f"The message was {str(exc)!r}; name the value."
        return
    raise AssertionError("Purse(-1) should raise ValueError.")


def test_cannot_overspend():
    """You cannot spend what you do not have"""
    Purse = require("Purse", "class")
    purse = Purse(45)
    try:
        purse.spend(100)
    except ValueError as exc:
        assert "100" in str(exc) and "45" in str(exc), (
            f"The message was {str(exc)!r}; naming both numbers is what makes it useful."
        )
        assert purse.balance == 45, (
            f"The purse now holds {purse.balance}. Check before you change anything — "
            "a method that half-applies a change and then raises is worse than one "
            "that refuses cleanly."
        )
        return
    raise AssertionError("Spending more than the balance should raise ValueError.")


def test_negative_amounts_refused():
    """Adding or spending a negative is a mistake, not a trick"""
    Purse = require("Purse", "class")
    for method in ("add", "spend"):
        purse = Purse(10)
        try:
            getattr(purse, method)(-5)
        except ValueError:
            continue
        raise AssertionError(f"purse.{method}(-5) should raise ValueError.")


def test_len_and_str():
    """The purse answers the questions Python knows how to ask"""
    Purse = require("Purse", "class")
    purse = Purse(45)
    assert len(purse) == 45, (
        "len(purse) does not work. Define __len__ to return the balance."
    )
    assert str(purse) == "a purse of 45 coins", f"str(purse) gave {str(purse)!r}"
