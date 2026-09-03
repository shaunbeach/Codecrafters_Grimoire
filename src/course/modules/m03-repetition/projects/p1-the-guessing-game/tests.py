def test_secret_is_in_range():
    """pick_secret stays inside the range, including both ends"""
    pick_secret = require("pick_secret")
    seen = set()
    for _ in range(400):
        value = pick_secret(1, 6)
        assert isinstance(value, int), (
            f"pick_secret should return an int, got {type(value).__name__}. "
            "random.randint is the tool here."
        )
        assert 1 <= value <= 6, f"pick_secret(1, 6) returned {value}, which is out of range."
        seen.add(value)
    assert seen == {1, 2, 3, 4, 5, 6}, (
        f"Over 400 calls pick_secret(1, 6) only ever produced {sorted(seen)}. "
        "randint includes both ends — randrange and randint differ here."
    )


def test_hints_are_right():
    """Low, high and correct guesses each get the right hint"""
    play_round = require("play_round")
    assert play_round(7, [3, 9, 7, 1]) == ["too low", "too high", "correct"], (
        f"Got {play_round(7, [3, 9, 7, 1])}"
    )
    assert play_round(50, [50]) == ["correct"]


def test_stops_at_correct():
    """Guesses after the correct one are ignored"""
    play_round = require("play_round")
    result = play_round(7, [7, 1, 2, 3])
    assert result == ["correct"], (
        f"Expected ['correct'] but got {result}. Use break to leave the loop."
    )


def test_running_out():
    """A round with no correct guess ends with 'out of guesses'"""
    play_round = require("play_round")
    assert play_round(7, [1, 2]) == ["too low", "too low", "out of guesses"], (
        f"Got {play_round(7, [1, 2])}"
    )
    assert play_round(7, []) == ["out of guesses"], (
        f"An empty guess list should still return ['out of guesses'], got {play_round(7, [])}"
    )


def test_returns_a_list():
    """play_round returns a list, it does not print"""
    play_round = require("play_round")
    result, printed = capture(play_round, 7, [7])
    assert isinstance(result, list), f"Expected a list, got {type(result).__name__}."
    assert not printed.strip(), "play_round should return its hints, not print them."
