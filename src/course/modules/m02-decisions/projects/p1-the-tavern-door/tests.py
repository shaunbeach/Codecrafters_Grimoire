NO_ID = "No ID, no entry."
WELCOME = "Welcome to the Rusty Tankard!"
ELDER = "Free ale for the elders!"


def test_no_id_wins():
    """Anyone without ID is turned away, whatever their age"""
    check_entry = require("check_entry")
    for age in [5, 17, 18, 40, 120]:
        assert check_entry(age, False) == NO_ID, (
            f"check_entry({age}, False) should be {NO_ID!r}, got {check_entry(age, False)!r}. "
            "Check the ID before you check the age."
        )


def test_too_young():
    """Under-18s are told how long to wait"""
    check_entry = require("check_entry")
    assert check_entry(15, True) == "Come back in 3 years."
    assert check_entry(17, True) == "Come back in 1 years."
    assert check_entry(0, True) == "Come back in 18 years."


def test_adults_welcome():
    """18 through 99 get in"""
    check_entry = require("check_entry")
    for age in [18, 19, 45, 99]:
        assert check_entry(age, True) == WELCOME, (
            f"check_entry({age}, True) should be {WELCOME!r}, got {check_entry(age, True)!r}"
        )


def test_the_elders():
    """100 and over drink free"""
    check_entry = require("check_entry")
    for age in [100, 101, 250]:
        assert check_entry(age, True) == ELDER, (
            f"check_entry({age}, True) should be {ELDER!r}, got {check_entry(age, True)!r}. "
            "Remember that 100 itself counts as an elder."
        )
