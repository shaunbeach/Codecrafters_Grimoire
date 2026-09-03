ADJECTIVES = ["Grim", "Swift", "Ancient"]
NOUNS = ["Wolf", "Fang", "Ember"]
COMBOS = {f"{a} {n}" for a in ADJECTIVES for n in NOUNS}


def test_name_format():
    """A name is one adjective, a space, and one noun"""
    generate_name = require("generate_name")
    name = generate_name(ADJECTIVES, NOUNS)
    assert isinstance(name, str), f"Expected a string, got {type(name).__name__}."
    assert name in COMBOS, (
        f"generate_name returned {name!r}, which is not an adjective and a noun "
        "joined by a single space."
    )


def test_both_lists_are_used():
    """Over many calls, every adjective and every noun shows up"""
    generate_name = require("generate_name")
    seen = {generate_name(ADJECTIVES, NOUNS) for _ in range(300)}
    used_adjectives = {name.split(" ")[0] for name in seen}
    used_nouns = {name.split(" ")[1] for name in seen}
    assert used_adjectives == set(ADJECTIVES), (
        f"Only these adjectives ever appeared: {sorted(used_adjectives)}. "
        "Are you picking randomly from the whole list?"
    )
    assert used_nouns == set(NOUNS), (
        f"Only these nouns ever appeared: {sorted(used_nouns)}."
    )


def test_single_item_lists():
    """Lists of one still work"""
    generate_name = require("generate_name")
    assert generate_name(["Grim"], ["Wolf"]) == "Grim Wolf"


def test_party_size():
    """generate_party returns exactly the number of names asked for"""
    generate_party = require("generate_party")
    for size in [0, 1, 5, 12]:
        party = generate_party(ADJECTIVES, NOUNS, size)
        assert isinstance(party, list), f"Expected a list, got {type(party).__name__}."
        assert len(party) == size, f"Asked for {size} names, got {len(party)}."


def test_party_members_are_valid():
    """Every name in the party is a real adjective/noun pair"""
    generate_party = require("generate_party")
    party = generate_party(ADJECTIVES, NOUNS, 20)
    for name in party:
        assert name in COMBOS, f"{name!r} is not a valid generated name."
