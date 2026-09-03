def test_an_ordinary_count():
    """With nothing unlucky in it, it is just a sum"""
    tally = require("tally")
    assert tally([1, 2, 3]) == 6, f"Got {tally([1, 2, 3])!r}"
    assert tally([10, 20, 30]) == 60


def test_thirteen_is_skipped():
    """The cursed number adds nothing but does not stop the count"""
    tally = require("tally")
    assert tally([1, 13, 2]) == 3, (
        f"Got {tally([1, 13, 2])!r}. The 13 contributes nothing, but the 2 after it "
        "still counts — that is `continue`, not `break`."
    )
    assert tally([13, 13, 5]) == 5


def test_zero_ends_the_count():
    """Everything after the void is ignored"""
    tally = require("tally")
    assert tally([1, 2, 0, 99, 99]) == 3, (
        f"Got {tally([1, 2, 0, 99, 99])!r}. A 0 stops the loop — that is `break`."
    )
    assert tally([0, 5, 5]) == 0


def test_both_at_once():
    """A list with both behaves"""
    tally = require("tally")
    assert tally([4, 13, 6, 0, 100]) == 10, f"Got {tally([4, 13, 6, 0, 100])!r}"


def test_edges():
    """Nothing to count, and nothing but a curse"""
    tally = require("tally")
    assert tally([]) == 0, f"Got {tally([])!r}"
    assert tally([13]) == 0, f"Got {tally([13])!r}"


def test_negatives_are_ordinary():
    """Only 13 and 0 are special"""
    tally = require("tally")
    assert tally([-5, 10]) == 5, f"Got {tally([-5, 10])!r}"
