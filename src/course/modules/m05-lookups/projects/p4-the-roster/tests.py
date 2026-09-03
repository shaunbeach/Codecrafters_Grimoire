ROSTER = {
    "Kira": {"rank": "Captain", "town": "Marrow Ford"},
    "Bo": {"rank": "Apprentice"},
}


def test_reads_a_recorded_field():
    """A member with the detail on their page"""
    look_up = require("look_up")
    assert look_up(ROSTER, "Kira", "rank") == "Captain", (
        f"Got {look_up(ROSTER, 'Kira', 'rank')!r}"
    )
    assert look_up(ROSTER, "Kira", "town") == "Marrow Ford"


def test_missing_field():
    """A member whose page does not record that detail"""
    look_up = require("look_up")
    assert look_up(ROSTER, "Bo", "town") == "unrecorded", (
        f"Got {look_up(ROSTER, 'Bo', 'town')!r}. Bo exists; his town does not."
    )


def test_missing_member():
    """Someone who is not in the book at all"""
    look_up = require("look_up")
    assert look_up(ROSTER, "Ana", "rank") == "no such member", (
        f"Got {look_up(ROSTER, 'Ana', 'rank')!r}. A missing member and a missing "
        "field are different answers."
    )


def test_empty_roster():
    """An empty book has nobody in it"""
    look_up = require("look_up")
    assert look_up({}, "Kira", "rank") == "no such member"


def test_never_raises():
    """No lookup blows up, whatever it is asked"""
    look_up = require("look_up")
    for name, field in [("Ana", "rank"), ("Bo", "hat"), ("", ""), ("Kira", "shoe")]:
        try:
            look_up(ROSTER, name, field)
        except KeyError:
            raise AssertionError(
                f"look_up(roster, {name!r}, {field!r}) raised KeyError. Use .get() "
                "rather than square brackets for both lookups."
            )
