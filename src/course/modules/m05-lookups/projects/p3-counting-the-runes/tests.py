def test_counts_letters():
    """Every letter is tallied"""
    count_runes = require("count_runes")
    result = count_runes("mississippi")
    assert isinstance(result, dict), f"Expected a dict, got {type(result).__name__}."
    assert result == {"m": 1, "i": 4, "s": 4, "p": 2}, f"Got {result}"


def test_case_is_ignored():
    """A and a are the same rune"""
    count_runes = require("count_runes")
    assert count_runes("AaA") == {"a": 3}, (
        f"Got {count_runes('AaA')} — lower the letter before you use it as a key."
    )


def test_punctuation_and_spaces_ignored():
    """Only letters are counted"""
    count_runes = require("count_runes")
    result = count_runes("a b, c! 42")
    assert result == {"a": 1, "b": 1, "c": 1}, (
        f"Got {result}. .isalpha() tells you whether a character is a letter."
    )


def test_a_full_phrase():
    """It holds up on a real inscription"""
    count_runes = require("count_runes")
    result = count_runes("Attack At Dawn")
    assert result["a"] == 4, f"Expected 4 a's, got {result.get('a')!r}"
    assert result["t"] == 3, f"Expected 3 t's, got {result.get('t')!r}"
    assert " " not in result and len(result) == 7, f"Got {result}"


def test_empty_stone():
    """Nothing carved, nothing counted"""
    count_runes = require("count_runes")
    assert count_runes("") == {}, f"Got {count_runes('')}"
    assert count_runes("!!! 123") == {}, f"Got {count_runes('!!! 123')}"
