def test_finds_the_overlap():
    """Names on both rosters come back, sorted"""
    common_allies = require("common_allies")
    result = common_allies(["Kira", "Bo", "Rex"], ["Rex", "Ana", "Kira"])
    assert isinstance(result, list), f"Expected a list, got {type(result).__name__}."
    assert result == ["Kira", "Rex"], f"Got {result}"


def test_no_overlap():
    """Two rosters with nobody in common"""
    common_allies = require("common_allies")
    assert common_allies(["Kira"], ["Ana"]) == [], f"Got {common_allies(['Kira'], ['Ana'])}"


def test_no_duplicates():
    """A name twice on one roster is still one ally"""
    common_allies = require("common_allies")
    assert common_allies(["Kira", "Kira", "Bo"], ["Kira"]) == ["Kira"], (
        f"Got {common_allies(['Kira', 'Kira', 'Bo'], ['Kira'])} — check the name is "
        "not already collected before adding it."
    )


def test_sorted_output():
    """Alphabetical, whatever order the rosters were in"""
    common_allies = require("common_allies")
    assert common_allies(["Zed", "Ana", "Mo"], ["Mo", "Zed", "Ana"]) == ["Ana", "Mo", "Zed"], (
        f"Got {common_allies(['Zed', 'Ana', 'Mo'], ['Mo', 'Zed', 'Ana'])}"
    )


def test_empty_rosters():
    """Nothing in, nothing out"""
    common_allies = require("common_allies")
    assert common_allies([], ["Kira"]) == []
    assert common_allies(["Kira"], []) == []
    assert common_allies([], []) == []


def test_rosters_untouched():
    """Neither list is modified"""
    common_allies = require("common_allies")
    a, b = ["Kira", "Bo"], ["Bo", "Ana"]
    common_allies(a, b)
    assert a == ["Kira", "Bo"] and b == ["Bo", "Ana"], (
        f"The rosters came back as {a} and {b}."
    )
