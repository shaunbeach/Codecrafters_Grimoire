def test_a_short_path():
    """hailstone(6) walks all the way down to 1"""
    hailstone = require("hailstone")
    result = hailstone(6)
    assert isinstance(result, list), f"Expected a list, got {type(result).__name__}."
    assert result == [6, 3, 10, 5, 16, 8, 4, 2, 1], f"Got {result}"


def test_already_there():
    """Starting at 1 is a path of one step"""
    hailstone = require("hailstone")
    assert hailstone(1) == [1], (
        f"Got {hailstone(1)}. Put n into the list before the loop, and the loop body "
        "simply never runs."
    )


def test_starts_and_ends_correctly():
    """Every path begins where you started and ends at 1"""
    hailstone = require("hailstone")
    for start in (2, 7, 27):
        path = hailstone(start)
        assert path[0] == start, f"hailstone({start}) begins with {path[0]}"
        assert path[-1] == 1, f"hailstone({start}) ends with {path[-1]}"


def test_whole_numbers_only():
    """Halving keeps the numbers whole"""
    hailstone = require("hailstone")
    path = hailstone(6)
    assert all(isinstance(step, int) for step in path), (
        f"Got {path}. Use // to halve — plain / gives floats."
    )


def test_a_long_path():
    """27 takes 111 steps to fall"""
    hailstone = require("hailstone")
    assert len(hailstone(27)) == 112, (
        f"hailstone(27) came out {len(hailstone(27))} long; it should be 112 entries "
        "including both 27 and the final 1."
    )
