def test_a_strong_ward():
    """A phrase meeting every rule is accepted"""
    ward_strength = require("ward_strength")
    assert ward_strength("Th1s is str0ng") == "ACCEPTED", (
        f"Got {ward_strength('Th1s is str0ng')!r}"
    )


def test_too_short():
    """Length is checked first"""
    ward_strength = require("ward_strength")
    assert ward_strength("short1A") == "too short", f"Got {ward_strength('short1A')!r}"
    assert ward_strength("") == "too short"


def test_needs_a_capital():
    """No uppercase anywhere"""
    ward_strength = require("ward_strength")
    assert ward_strength("alllowercase1") == "needs a capital", (
        f"Got {ward_strength('alllowercase1')!r}"
    )


def test_needs_a_lowercase():
    """No lowercase anywhere"""
    ward_strength = require("ward_strength")
    assert ward_strength("ALLUPPERCASE1") == "needs a lowercase letter", (
        f"Got {ward_strength('ALLUPPERCASE1')!r}"
    )


def test_needs_a_digit():
    """Letters alone are not enough"""
    ward_strength = require("ward_strength")
    assert ward_strength("NoDigitsInHere") == "needs a digit", (
        f"Got {ward_strength('NoDigitsInHere')!r}"
    )


def test_first_failure_wins():
    """A phrase breaking several rules reports the first"""
    ward_strength = require("ward_strength")
    assert ward_strength("short") == "too short", (
        f"Got {ward_strength('short')!r}. 'short' fails three rules; the length is "
        "listed first, so that is the one the caller hears about."
    )


def test_any_not_all():
    """One capital is enough; they need not all be"""
    ward_strength = require("ward_strength")
    assert ward_strength("Onecapital123") == "ACCEPTED", (
        f"Got {ward_strength('Onecapital123')!r}. any(c.isupper() for c in phrase) "
        "asks whether at least one is — phrase.isupper() asks whether all are."
    )
