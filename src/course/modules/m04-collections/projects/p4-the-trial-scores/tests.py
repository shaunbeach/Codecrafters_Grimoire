def test_drops_the_lowest():
    """The worst attempt is forgiven"""
    judge = require("judge")
    assert judge([60, 90, 90]) == 90.0, f"Got {judge([60, 90, 90])!r}"
    assert judge([10, 20]) == 20.0


def test_rounded_to_two_places():
    """Averages come back rounded"""
    judge = require("judge")
    assert judge([1, 2, 2, 3]) == 2.33, (
        f"Got {judge([1, 2, 2, 3])!r} — dropping the 1 leaves 2, 2 and 3."
    )


def test_only_one_is_dropped():
    """Ties do not all get forgiven"""
    judge = require("judge")
    assert judge([60, 60, 90]) == 75.0, (
        f"Got {judge([60, 60, 90])!r}. One 60 is dropped; the other still counts."
    )


def test_too_few_scores():
    """With nothing left to average, the answer is zero"""
    judge = require("judge")
    try:
        assert judge([75]) == 0.0, f"Got {judge([75])!r}"
        assert judge([]) == 0.0, f"Got {judge([])!r}"
    except ZeroDivisionError:
        raise AssertionError(
            "judge divided by zero. Handle lists of fewer than two scores before "
            "you average anything."
        )


def test_the_original_is_untouched():
    """The guild's record is left as it was"""
    judge = require("judge")
    record = [90, 60, 75]
    judge(record)
    assert record == [90, 60, 75], (
        f"The list came back as {record}. sorted(scores) makes a copy; "
        "scores.sort() rearranges theirs."
    )


def test_returns_a_float():
    """The average is a number"""
    judge = require("judge")
    assert isinstance(judge([60, 90]), float), (
        f"Expected a float, got {type(judge([60, 90])).__name__}."
    )
