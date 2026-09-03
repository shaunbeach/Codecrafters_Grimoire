def test_lowercase_inscription():
    """Each word gets a capital"""
    read_runes = require("read_runes")
    result = read_runes("the rusty tankard")
    assert isinstance(result, str), f"Expected a string, got {type(result).__name__}."
    assert result == "The Rusty Tankard", f"Got {result!r}"


def test_shouted_inscription():
    """Capitals are brought back down"""
    read_runes = require("read_runes")
    assert read_runes("THE RUSTY TANKARD") == "The Rusty Tankard", (
        f"Got {read_runes('THE RUSTY TANKARD')!r}. .capitalize() lowers the rest of "
        "the word as well as raising the first letter."
    )


def test_mixed_case():
    """However it was carved, it comes out the same"""
    read_runes = require("read_runes")
    assert read_runes("tHe rUsTy TaNkArD") == "The Rusty Tankard"


def test_extra_spaces_collapse():
    """A slipped chisel is forgiven"""
    read_runes = require("read_runes")
    assert read_runes("  the   rusty   tankard  ") == "The Rusty Tankard", (
        f"Got {read_runes('  the   rusty   tankard  ')!r}. .split() with no argument "
        "collapses runs of whitespace for you."
    )


def test_single_word():
    """One word still works"""
    read_runes = require("read_runes")
    assert read_runes("goblin") == "Goblin"


def test_empty_inscription():
    """Nothing in, nothing out"""
    read_runes = require("read_runes")
    assert read_runes("") == "", f"Got {read_runes('')!r}"
    assert read_runes("   ") == "", (
        f"Got {read_runes('   ')!r} — text that is only spaces has no words in it."
    )
