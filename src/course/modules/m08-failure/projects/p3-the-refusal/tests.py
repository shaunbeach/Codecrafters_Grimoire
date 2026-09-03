def test_the_base_fare():
    """A light parcel is the base rate"""
    carriage_cost = require("carriage_cost")
    assert carriage_cost(0.5) == 5.0, f"Got {carriage_cost(0.5)!r}"
    assert carriage_cost(1) == 5.0


def test_by_the_stone():
    """Each whole stone above the first adds two"""
    carriage_cost = require("carriage_cost")
    assert carriage_cost(2) == 7.0, f"Got {carriage_cost(2)!r}"
    assert carriage_cost(10) == 23.0, f"Got {carriage_cost(10)!r}"


def test_part_stones_round_down():
    """Half a stone is not half a charge"""
    carriage_cost = require("carriage_cost")
    assert carriage_cost(2.9) == 7.0, (
        f"Got {carriage_cost(2.9)!r} — whole stones only, so int(weight)."
    )


def test_refuses_zero_and_below():
    """An impossible weight is refused, not priced"""
    carriage_cost = require("carriage_cost")
    for bad in (0, -4):
        try:
            carriage_cost(bad)
        except ValueError as exc:
            assert str(bad) in str(exc), (
                f"The message for {bad} was {str(exc)!r}; naming the value is what "
                "makes the error useful."
            )
            continue
        raise AssertionError(f"carriage_cost({bad}) should raise ValueError.")


def test_refuses_non_numbers():
    """Text is a different mistake, and gets a different exception"""
    carriage_cost = require("carriage_cost")
    try:
        carriage_cost("heavy")
    except TypeError as exc:
        assert "str" in str(exc), f"The message was {str(exc)!r}; name the type."
        return
    except ValueError:
        raise AssertionError(
            "A non-number raised ValueError. The right type with a bad value is a "
            "ValueError; the wrong type entirely is a TypeError."
        )
    raise AssertionError("carriage_cost('heavy') should raise TypeError.")


def test_booleans_are_refused():
    """True is not a weight, whatever Python thinks"""
    carriage_cost = require("carriage_cost")
    try:
        carriage_cost(True)
    except TypeError:
        return
    raise AssertionError(
        "carriage_cost(True) was accepted. isinstance(True, int) is True in Python, "
        "so booleans need refusing explicitly."
    )
