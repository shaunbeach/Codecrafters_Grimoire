def test_safe_int_good_values():
    """Valid text converts as normal"""
    safe_int = require("safe_int")
    assert safe_int("42") == 42
    assert safe_int("-7") == -7
    assert safe_int("  8  ") == 8, "int() copes with surrounding whitespace by itself."


def test_safe_int_bad_values():
    """Anything unconvertible falls back to the default"""
    safe_int = require("safe_int")
    for bad in ["banana", "", "3.5", "12a"]:
        assert safe_int(bad) == 0, f"safe_int({bad!r}) should give 0, got {safe_int(bad)!r}"


def test_safe_int_custom_default():
    """The default is configurable"""
    safe_int = require("safe_int")
    assert safe_int("banana", -1) == -1
    assert safe_int("banana", default=99) == 99, "default should work as a keyword argument."


def test_safe_int_never_raises():
    """Even the wrong type comes back as the default"""
    safe_int = require("safe_int")
    for bad in [None, ["a"], {}, object()]:
        try:
            result = safe_int(bad)
        except Exception as exc:
            raise AssertionError(
                f"safe_int({bad!r}) raised {type(exc).__name__}. int(None) raises "
                "TypeError, not ValueError — catch both."
            )
        assert result == 0, f"safe_int({bad!r}) should give 0, got {result!r}"


def test_average():
    """average does the obvious thing"""
    average = require("average")
    assert average([1, 2, 3]) == 2.0
    assert average([10]) == 10.0


def test_average_of_empty():
    """An empty list averages to 0.0"""
    average = require("average")
    try:
        result = average([])
    except ZeroDivisionError:
        raise AssertionError(
            "average([]) raised ZeroDivisionError — catch it and return 0.0."
        )
    assert result == 0.0, f"Expected 0.0, got {result!r}"
