def test_ask_accepts_good_input():
    """A valid answer first time is returned straight away"""
    ask_for_number = require("ask_for_number")
    set_input(["42"])
    result = ask_for_number("Age? ")
    assert result == 42, f"Expected 42, got {result!r}"
    assert isinstance(result, int), f"Expected an int, got {type(result).__name__}."


def test_ask_retries():
    """Bad answers are rejected until a good one arrives"""
    ask_for_number = require("ask_for_number")
    set_input(["banana", "", "7"])
    clear_output()
    result = ask_for_number("Age? ")
    printed = get_output()
    assert result == 7, f"Expected 7 once a valid answer arrived, got {result!r}"
    assert printed.count("That is not a whole number.") == 2, (
        "Expected the message 'That is not a whole number.' once per bad answer "
        f"(twice here). Your output was:\n{printed}"
    )


def test_ask_uses_the_prompt():
    """The prompt is passed to input()"""
    ask_for_number = require("ask_for_number")
    set_input(["3"])
    clear_output()
    ask_for_number("How old? ")
    assert "How old?" in get_output(), (
        "The prompt did not reach input(). Pass it through: input(prompt)."
    )
