def reference(n):
    out = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            out.append("FizzBuzz")
        elif i % 3 == 0:
            out.append("Fizz")
        elif i % 5 == 0:
            out.append("Buzz")
        else:
            out.append(str(i))
    return out


def test_first_five():
    """fizzbuzz(5) gives ['1', '2', 'Fizz', '4', 'Buzz']"""
    fizzbuzz = require("fizzbuzz")
    result = fizzbuzz(5)
    assert result == ["1", "2", "Fizz", "4", "Buzz"], f"Got {result}"


def test_everything_is_a_string():
    """Plain numbers are returned as strings, not ints"""
    fizzbuzz = require("fizzbuzz")
    result = fizzbuzz(4)
    assert result[0] == "1", (
        f"The first entry is {result[0]!r}. Wrap plain numbers in str()."
    )
    assert all(isinstance(item, str) for item in result), (
        "Every entry in the list must be a string."
    )


def test_fizzbuzz_case():
    """Multiples of 15 are FizzBuzz, not Fizz"""
    fizzbuzz = require("fizzbuzz")
    result = fizzbuzz(30)
    for index in (14, 29):
        assert result[index] == "FizzBuzz", (
            f"Position {index + 1} should be 'FizzBuzz' but is {result[index]!r}. "
            "Check the order of your conditions."
        )


def test_the_full_hundred():
    """The whole sequence up to 100 is correct"""
    fizzbuzz = require("fizzbuzz")
    result = fizzbuzz(100)
    expected = reference(100)
    assert len(result) == 100, f"fizzbuzz(100) should have 100 entries, got {len(result)}."
    for i, (got, want) in enumerate(zip(result, expected), start=1):
        assert got == want, f"For {i} expected {want!r} but got {got!r}"


def test_edges():
    """fizzbuzz(0) is empty and fizzbuzz(1) has one entry"""
    fizzbuzz = require("fizzbuzz")
    assert fizzbuzz(0) == [], f"fizzbuzz(0) should be an empty list, got {fizzbuzz(0)}"
    assert fizzbuzz(1) == ["1"], (
        f"fizzbuzz(1) should be ['1'], got {fizzbuzz(1)}. "
        "Remember range(1, n + 1) to include n itself."
    )
