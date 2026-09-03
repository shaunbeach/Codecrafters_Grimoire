PATHS = {
    ("left", "fight"): "VICTORY",
    ("left", "flee"): "SAFE_HOME",
    ("right", "knock"): "TREASURE",
    ("right", "open"): "GOBLIN_FEAST",
}


def test_every_ending_is_reachable():
    """All four endings can be reached"""
    adventure = require("adventure")
    for path, ending in PATHS.items():
        result = adventure(list(path))
        assert result == ending, (
            f"adventure({list(path)}) should return {ending!r}, got {result!r}"
        )


def test_unknown_first_choice():
    """An unrecognised first choice gets you lost"""
    adventure = require("adventure")
    for path in [["up", "fight"], ["", "open"], ["LEFT", "fight"]]:
        assert adventure(path) == "LOST", (
            f"adventure({path}) should return 'LOST' — only exact lowercase "
            f"'left' and 'right' are valid."
        )


def test_unknown_second_choice():
    """An unrecognised second choice gets you lost too"""
    adventure = require("adventure")
    assert adventure(["left", "sing"]) == "LOST"
    assert adventure(["right", "sing"]) == "LOST"


def test_running_out_of_choices():
    """Too few choices is a LOST, not a crash"""
    adventure = require("adventure")
    for path in [[], ["left"], ["right"]]:
        try:
            result = adventure(path)
        except IndexError:
            raise AssertionError(
                f"adventure({path}) crashed with IndexError. "
                "Check len(choices) before reading choices[1]."
            )
        assert result == "LOST", f"adventure({path}) should return 'LOST', got {result!r}"


def test_extra_choices_ignored():
    """Anything after the ending is ignored"""
    adventure = require("adventure")
    assert adventure(["left", "fight", "dance", "sleep"]) == "VICTORY"
