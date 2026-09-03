def test_the_ordinary_sale():
    """One argument is enough"""
    price = require("price")
    try:
        result = price(100)
    except TypeError as exc:
        raise AssertionError(
            f"price(100) failed: {exc}. Give discount_percent and tax_rate defaults."
        )
    assert result == 105.0, f"Got {result!r} — 100 plus the usual 5% tax."


def test_with_a_discount():
    """Tax is charged on the discounted price"""
    price = require("price")
    assert price(100, 10) == 94.5, (
        f"Got {price(100, 10)!r}. 10% off 100 is 90; 5% tax on 90 is 94.5. "
        "Discount first, then tax."
    )


def test_named_arguments():
    """Either part can be named and the other left alone"""
    price = require("price")
    assert price(100, discount_percent=10) == 94.5
    assert price(100, tax_rate=0) == 100.0, (
        f"Got {price(100, tax_rate=0)!r} — naming tax_rate should skip past the discount."
    )


def test_a_different_tax():
    """Both can be given by position"""
    price = require("price")
    assert price(100, 0, 0.2) == 120.0, f"Got {price(100, 0, 0.2)!r}"


def test_rounded():
    """Awkward numbers come back to the penny"""
    price = require("price")
    assert price(19.99, 15) == 17.84, (
        f"Got {price(19.99, 15)!r} — round the result to 2 decimal places."
    )


def test_returns_a_number():
    """The price is a number, not a string"""
    price = require("price")
    assert isinstance(price(100), float), (
        f"Expected a float, got {type(price(100)).__name__}."
    )
