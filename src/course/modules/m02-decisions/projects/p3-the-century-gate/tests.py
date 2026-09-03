def test_ordinary_leap_year():
    """A year divisible by 4 carries the extra day"""
    is_leap_year = require("is_leap_year")
    assert is_leap_year(2024) is True, f"2024 gave {is_leap_year(2024)!r}"
    assert is_leap_year(1996) is True


def test_ordinary_year():
    """Most years do not"""
    is_leap_year = require("is_leap_year")
    assert is_leap_year(2023) is False, f"2023 gave {is_leap_year(2023)!r}"
    assert is_leap_year(2025) is False


def test_the_century_exception():
    """A century year is not a leap year"""
    is_leap_year = require("is_leap_year")
    assert is_leap_year(1900) is False, (
        f"1900 gave {is_leap_year(1900)!r}. It divides by 4, but the century rule "
        "overrides that."
    )
    assert is_leap_year(2100) is False


def test_the_exception_to_the_exception():
    """A year divisible by 400 is a leap year after all"""
    is_leap_year = require("is_leap_year")
    assert is_leap_year(2000) is True, (
        f"2000 gave {is_leap_year(2000)!r}. Test the 400 rule before the 100 rule, "
        "or the century rule catches it first."
    )
    assert is_leap_year(1600) is True


def test_returns_a_real_boolean():
    """The answer is True or False, not the words"""
    is_leap_year = require("is_leap_year")
    result = is_leap_year(2024)
    assert isinstance(result, bool), (
        f"Expected a bool, got {type(result).__name__}: {result!r}"
    )
