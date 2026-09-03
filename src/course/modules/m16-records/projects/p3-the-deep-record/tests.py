DATA = {"results": [{"address": {"city": "Marrow Ford"}}], "count": 1, "guild": None}


def test_digs_all_the_way_down():
    """Four levels, mixing dicts and lists"""
    dig = require("dig")
    assert dig(DATA, ["results", 0, "address", "city"]) == "Marrow Ford", (
        f"Got {dig(DATA, ['results', 0, 'address', 'city'])!r}"
    )


def test_shallow_and_empty_paths():
    """One step, and no steps at all"""
    dig = require("dig")
    assert dig(DATA, ["count"]) == 1
    assert dig(DATA, []) == DATA, "An empty path returns what it was given."


def test_missing_key():
    """A key that is not there gives the default"""
    dig = require("dig")
    assert dig(DATA, ["results", 0, "phone"]) is None
    assert dig(DATA, ["results", 0, "phone"], "unlisted") == "unlisted"


def test_index_past_the_end():
    """A position that does not exist gives the default"""
    dig = require("dig")
    assert dig(DATA, ["results", 9, "address"]) is None, (
        "An index past the end of a list should give the default, not raise."
    )


def test_wrong_container():
    """Indexing a dict like a list, or the reverse"""
    dig = require("dig")
    assert dig(DATA, ["count", 0]) is None, "count is a number; you cannot index into it."
    assert dig(DATA, ["results", "city"]) is None, "results is a list, not a dict."


def test_never_raises():
    """Whatever it is handed, it answers"""
    dig = require("dig")
    for data in (None, 42, "text", [], {}):
        try:
            assert dig(data, ["a", 0, "b"], "safe") == "safe"
        except Exception as exc:
            raise AssertionError(f"dig({data!r}, ...) raised {type(exc).__name__}: {exc}")


def test_a_real_none_is_returned():
    """A value that is genuinely None is not a miss"""
    dig = require("dig")
    assert dig(DATA, ["guild"], "default") is None, (
        "guild exists and holds None. Returning the default here would be wrong — "
        "check the key is present rather than testing the value for truthiness."
    )
