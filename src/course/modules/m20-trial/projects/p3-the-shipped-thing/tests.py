import json
import os

SCRATCH = "/tmp/day30"
_counter = [0]


def _fresh():
    os.makedirs(SCRATCH, exist_ok=True)
    _counter[0] += 1
    path = os.path.join(SCRATCH, f"save{_counter[0]}.json")
    if os.path.exists(path):
        os.remove(path)
    return path


def test_new_state():
    """A new game starts in the clearing with nothing"""
    new_state = require("new_state")
    state = new_state()
    assert state == {"room": "clearing", "inventory": [], "moves": 0}, f"Got {state!r}"
    new_state()["inventory"].append("rope")
    assert new_state()["inventory"] == [], "Each call should build a fresh dict."


def test_save_writes_json():
    """save_game writes real JSON"""
    save_game = require("save_game")
    path = _fresh()
    save_game(path, {"room": "cave", "inventory": ["rope"], "moves": 3})
    with open(path) as handle:
        loaded = json.load(handle)
    assert loaded == {"room": "cave", "inventory": ["rope"], "moves": 3}, f"Got {loaded!r}"


def test_round_trip():
    """Saving then loading returns the same state"""
    save_game = require("save_game")
    load_game = require("load_game")
    path = _fresh()
    state = {"room": "cave", "inventory": ["coin", "rope"], "moves": 7}
    save_game(path, state)
    assert load_game(path) == state, f"Got {load_game(path)!r}"


def test_load_missing_file():
    """No save file means a new game"""
    load_game = require("load_game")
    new_state = require("new_state")
    path = os.path.join(SCRATCH, "never-saved.json")
    if os.path.exists(path):
        os.remove(path)
    try:
        assert load_game(path) == new_state()
    except FileNotFoundError:
        raise AssertionError("load_game should return a new state when the file is missing.")


def test_load_corrupt_file():
    """A half-written save file does not kill the game"""
    load_game = require("load_game")
    new_state = require("new_state")
    path = _fresh()
    with open(path, "w") as handle:
        handle.write('{"room": "cave", "inv')
    try:
        result = load_game(path)
    except Exception as exc:
        raise AssertionError(
            f"Corrupt JSON raised {type(exc).__name__}: {exc}. Catch "
            "json.JSONDecodeError (a subclass of ValueError)."
        )
    assert result == new_state(), f"Got {result!r}"


def test_load_wrong_shape():
    """Valid JSON that is not a game still gives a new game"""
    load_game = require("load_game")
    new_state = require("new_state")
    for junk in ["null", "[1, 2, 3]", '{"room": "cave"}', '"hello"']:
        path = _fresh()
        with open(path, "w") as handle:
            handle.write(junk)
        try:
            result = load_game(path)
        except Exception as exc:
            raise AssertionError(f"load_game({junk}) raised {type(exc).__name__}: {exc}")
        assert result == new_state(), (
            f"A save file containing {junk} should start a new game, got {result!r}. "
            "Check the parsed value is a dict with all the required keys."
        )


def test_play_basic_commands():
    """look, take and inventory all report properly"""
    play = require("play")
    path = _fresh()
    set_input(["look", "take rope", "inventory", "quit"])
    clear_output()
    state = play(path)
    printed = get_output()
    for expected in [
        "You are in the clearing.",
        "You take the rope.",
        "You are carrying: rope",
        "Goodbye.",
    ]:
        assert expected in printed, f"Expected {expected!r} in the output:\n{printed}"
    assert state["inventory"] == ["rope"], f"inventory is {state['inventory']!r}"


def test_play_empty_inventory():
    """Carrying nothing says so"""
    play = require("play")
    set_input(["inventory", "quit"])
    clear_output()
    play(_fresh())
    assert "You are carrying nothing." in get_output(), f"Your output was:\n{get_output()}"


def test_play_is_case_insensitive():
    """LOOK is look"""
    play = require("play")
    set_input(["LOOK", "Quit"])
    clear_output()
    play(_fresh())
    printed = get_output()
    assert "You are in the clearing." in printed, f"Your output was:\n{printed}"
    assert "Goodbye." in printed, "Quit with a capital Q should still quit."


def test_play_handles_junk():
    """Empty lines and nonsense are answered, not fatal"""
    play = require("play")
    set_input(["", "   ", "xyzzy", "take", "quit"])
    clear_output()
    try:
        state = play(_fresh())
    except Exception as exc:
        raise AssertionError(f"play raised {type(exc).__name__}: {exc}")
    printed = get_output()
    assert printed.count("Say something, or type help.") == 2, (
        f"Both blank lines should be answered. Your output was:\n{printed}"
    )
    assert "I do not understand 'xyzzy'. Try help." in printed, (
        f"Your output was:\n{printed}"
    )
    assert "Take what?" in printed, "`take` with no item should ask what to take."
    assert state["inventory"] == [], f"Nothing should have been picked up: {state['inventory']!r}"


def test_play_counts_understood_commands():
    """moves counts commands that worked"""
    play = require("play")
    set_input(["look", "xyzzy", "", "take rope", "quit"])
    state = play(_fresh())
    assert state["moves"] == 3, (
        f"moves is {state['moves']}. look, take and quit count; the unknown "
        "command and the blank line do not."
    )


def test_play_saves_and_resumes():
    """save writes progress that a later game picks up"""
    play = require("play")
    path = _fresh()
    set_input(["take rope", "save", "quit"])
    clear_output()
    play(path)
    assert "Game saved." in get_output(), f"Your output was:\n{get_output()}"

    set_input(["inventory", "quit"])
    clear_output()
    resumed = play(path)
    assert "You are carrying: rope" in get_output(), (
        f"The saved game did not come back. Your output was:\n{get_output()}"
    )
    assert resumed["inventory"] == ["rope"]


def test_play_shows_help():
    """help lists the commands"""
    play = require("play")
    set_input(["help", "quit"])
    clear_output()
    play(_fresh())
    printed = get_output().lower()
    for command in ["look", "take", "inventory", "save", "quit"]:
        assert command in printed, f"The help text does not mention {command!r}."


def test_play_survives_running_out_of_input():
    """A closed stdin ends the game cleanly"""
    play = require("play")
    set_input(["look"])
    clear_output()
    try:
        state = play(_fresh())
    except EOFError:
        raise AssertionError(
            "play let EOFError escape. Catch it around input() and return the state."
        )
    assert isinstance(state, dict), f"play should return the final state, got {state!r}"
