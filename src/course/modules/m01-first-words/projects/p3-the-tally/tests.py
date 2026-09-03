def _expected(total, tip_percent, people):
    tip = total * tip_percent / 100
    grand = total + tip
    return (
        f"Bill: ${total:.2f} + {tip_percent}% tip (${tip:.2f}) = ${grand:.2f}\n"
        f"Split {people} ways: ${grand / people:.2f} each"
    )


def test_returns_a_string():
    """split_bill returns a string rather than printing"""
    split_bill = require("split_bill")
    result, printed = capture(split_bill, 100, 15, 4)
    assert result is not None, (
        "split_bill returned None. If you used print(), swap it for return."
    )
    assert isinstance(result, str), f"Expected a string, got {type(result).__name__}."
    assert not printed.strip(), (
        "split_bill printed something. It should only return the string."
    )


def test_round_numbers():
    """A $100 bill, 15% tip, 4 people"""
    split_bill = require("split_bill")
    assert split_bill(100, 15, 4) == _expected(100, 15, 4), (
        "Expected:\n" + _expected(100, 15, 4) + "\n\nGot:\n" + str(split_bill(100, 15, 4))
    )


def test_awkward_numbers():
    """Amounts that do not divide neatly are rounded to the cent"""
    split_bill = require("split_bill")
    for args in [(56.7, 20, 3), (19.99, 18, 2), (247.5, 22, 7)]:
        assert split_bill(*args) == _expected(*args), (
            f"For split_bill{args} expected:\n{_expected(*args)}\n\nGot:\n{split_bill(*args)}"
        )


def test_zero_tip():
    """A 0% tip still shows $0.00, not 0"""
    split_bill = require("split_bill")
    assert split_bill(40, 0, 2) == _expected(40, 0, 2), (
        "Check your formatting — every money value needs :.2f."
    )
