def test_a_complete_scroll():
    """A well-filled form comes through unchanged"""
    read_scroll = require("read_scroll")
    result = read_scroll({"name": "Kira", "age": 30, "town": "Marrow Ford"})
    assert result == {"name": "Kira", "age": 30, "town": "Marrow Ford"}, f"Got {result}"


def test_always_the_same_shape():
    """Every result has all three keys"""
    read_scroll = require("read_scroll")
    for scroll in ({}, {"name": "Bo"}, {"age": 1}, "nonsense", None, 42):
        result = read_scroll(scroll)
        assert isinstance(result, dict), f"read_scroll({scroll!r}) gave {result!r}"
        assert set(result) == {"name", "age", "town"}, (
            f"read_scroll({scroll!r}) returned the keys {sorted(result)}"
        )


def test_missing_fields_get_defaults():
    """A half-filled form is completed"""
    read_scroll = require("read_scroll")
    assert read_scroll({"name": "Bo"}) == {"name": "Bo", "age": 0, "town": "unknown"}, (
        f"Got {read_scroll({'name': 'Bo'})}"
    )
    assert read_scroll({"age": 30})["name"] == "anonymous"


def test_numbers_in_quotes_still_count():
    """An age written as text is untidy, not wrong"""
    read_scroll = require("read_scroll")
    assert read_scroll({"age": "30"})["age"] == 30, (
        f"Got {read_scroll({'age': '30'})['age']!r} — int('30') works fine."
    )


def test_unconvertible_age():
    """An age that is not a number falls back"""
    read_scroll = require("read_scroll")
    assert read_scroll({"name": "Ana", "age": "not telling"})["age"] == 0, (
        "int('not telling') raises ValueError — catch it."
    )
    assert read_scroll({"age": None})["age"] == 0, (
        "int(None) raises TypeError, which is a different exception."
    )


def test_negative_age():
    """Nobody is minus four"""
    read_scroll = require("read_scroll")
    assert read_scroll({"age": -4})["age"] == 0, f"Got {read_scroll({'age': -4})['age']!r}"


def test_blank_strings_are_missing():
    """A field filled with spaces is not filled in"""
    read_scroll = require("read_scroll")
    assert read_scroll({"name": "   ", "town": ""})["name"] == "anonymous"
    assert read_scroll({"name": "   ", "town": ""})["town"] == "unknown"


def test_never_raises():
    """Whatever arrives, something sensible comes back"""
    read_scroll = require("read_scroll")
    for scroll in ("not a scroll at all", None, 42, [1, 2], {"age": ["x"]}):
        try:
            read_scroll(scroll)
        except Exception as exc:
            raise AssertionError(
                f"read_scroll({scroll!r}) raised {type(exc).__name__}: {exc}. This "
                "working is a boundary — the mess has to stop here."
            )
