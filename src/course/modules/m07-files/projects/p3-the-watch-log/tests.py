LOG = "/data/watch.log"


def test_counts_a_level():
    """Lines carrying the level are counted"""
    count_level = require("count_level")
    result = count_level(LOG, "ERROR")
    assert isinstance(result, int), f"Expected an int, got {type(result).__name__}."
    assert result == 2, f"Got {result} — there are two ERROR lines in the log."


def test_counts_another_level():
    """The level argument is actually used"""
    count_level = require("count_level")
    assert count_level(LOG, "INFO") == 2, f"Got {count_level(LOG, 'INFO')}"
    assert count_level(LOG, "WARN") == 1, f"Got {count_level(LOG, 'WARN')}"


def test_unknown_level():
    """A level that never appears counts zero"""
    count_level = require("count_level")
    assert count_level(LOG, "FATAL") == 0, f"Got {count_level(LOG, 'FATAL')}"


def test_the_match_is_exact():
    """ERRORLOG is not an ERROR line"""
    count_level = require("count_level")
    assert count_level(LOG, "ERROR") == 2, (
        f"Got {count_level(LOG, 'ERROR')}. The log contains an ERRORLOG: line — "
        "match on the level followed by a colon."
    )


def test_blank_lines_ignored():
    """An empty line is not an entry"""
    count_level = require("count_level")
    total = sum(count_level(LOG, level) for level in ("INFO", "WARN", "ERROR"))
    assert total == 5, f"The five real entries came to {total}."


def test_missing_log():
    """No log tonight means nothing to count"""
    count_level = require("count_level")
    try:
        assert count_level("/data/no-such.log", "ERROR") == 0
    except FileNotFoundError:
        raise AssertionError(
            "count_level raised FileNotFoundError. A watch that has not written yet "
            "has recorded zero errors, not an error of its own."
        )
