def test_panel_shape():
    """A titled panel has five lines, all the same width"""
    render_panel = require("render_panel")
    panel = render_panel("Hello there!", title="PythonBot", width=40)
    lines = panel.split("\n")
    assert len(lines) == 5, f"Expected 5 lines, got {len(lines)}:\n{panel}"
    for line in lines:
        assert len(line) == 40, f"This line is {len(line)} characters, not 40: {line!r}"


def test_panel_content():
    """The borders, title and text are where they should be"""
    render_panel = require("render_panel")
    lines = render_panel("Hello there!", title="PythonBot", width=40).split("\n")
    border = "+" + "-" * 38 + "+"
    assert lines[0] == border, f"Line 1 should be {border!r}, got {lines[0]!r}"
    assert lines[1] == "| PythonBot" + " " * 27 + " |", f"Got {lines[1]!r}"
    assert lines[2] == border
    assert lines[3] == "| Hello there!" + " " * 24 + " |", f"Got {lines[3]!r}"
    assert lines[4] == border


def test_panel_without_a_title():
    """No title means no title row"""
    render_panel = require("render_panel")
    lines = render_panel("Hello there!", width=40).split("\n")
    assert len(lines) == 3, f"Expected 3 lines without a title, got {len(lines)}:\n{chr(10).join(lines)}"
    assert lines[1] == "| Hello there!" + " " * 24 + " |", f"Got {lines[1]!r}"


def test_panel_wraps_long_text():
    """Text wider than the box wraps"""
    render_panel = require("render_panel")
    text = "This is a much longer message that will certainly not fit on one line."
    lines = render_panel(text, width=30).split("\n")
    assert len(lines) > 3, "A long message should wrap onto several rows."
    for line in lines:
        assert len(line) == 30, f"This line is {len(line)} characters, not 30: {line!r}"
    rebuilt = " ".join(line[2:-2].strip() for line in lines[1:-1])
    assert rebuilt == text, f"The wrapped text does not reassemble; got {rebuilt!r}"


def test_panel_with_empty_text():
    """An empty message still draws a box"""
    render_panel = require("render_panel")
    lines = render_panel("", width=20).split("\n")
    assert len(lines) == 3, (
        f"Expected 3 lines, got {len(lines)}. textwrap.wrap('') returns [] — "
        'fall back to [""].'
    )
    assert lines[1] == "|" + " " * 18 + "|", f"Got {lines[1]!r}"


def test_replies():
    """Each rule fires for the right message"""
    reply_to = require("reply_to")
    cases = {
        "": "Say something!",
        "   ": "Say something!",
        "hello": "Hello there!",
        "Hello!": "Hello there!",
        "hey there": "Hello there!",
        "how are you?": "That is a good question.",
        "the sky is blue": "Tell me more.",
        "bye": "Goodbye!",
        "Goodbye.": "Goodbye!",
    }
    for message, expected in cases.items():
        assert reply_to(message) == expected, (
            f"reply_to({message!r}) gave {reply_to(message)!r}, expected {expected!r}"
        )


def test_rule_order():
    """Farewells win over greetings and questions"""
    reply_to = require("reply_to")
    assert reply_to("hello and bye") == "Goodbye!", (
        f"Got {reply_to('hello and bye')!r} — check the farewell before the greeting."
    )
    assert reply_to("hi, how are you?") == "Hello there!", (
        f"Got {reply_to('hi, how are you?')!r} — the greeting is checked before the question mark."
    )


def test_matches_whole_words():
    """'this' does not contain a greeting"""
    reply_to = require("reply_to")
    assert reply_to("this is history") == "Tell me more.", (
        f"Got {reply_to('this is history')!r}. 'hi' appears inside 'this' and "
        "'history' — split into words before matching."
    )


def test_chat_returns_the_replies():
    """chat collects every reply in order"""
    chat = require("chat")
    set_input(["hello", "how are you?", "bye", "still here?"])
    clear_output()
    replies = chat()
    assert replies == ["Hello there!", "That is a good question.", "Goodbye!"], (
        f"Got {replies}. The loop should stop as soon as it says goodbye."
    )


def test_chat_prints_panels():
    """Every reply is framed and labelled"""
    chat = require("chat")
    set_input(["hello", "bye"])
    clear_output()
    chat()
    printed = get_output()
    assert printed.count("PythonBot") >= 2, (
        f"Expected a panel titled PythonBot per reply. Your output was:\n{printed}"
    )
    assert "+" + "-" * 38 + "+" in printed, (
        "The replies do not look framed — print render_panel(...) for each one."
    )


def test_chat_survives_running_out_of_input():
    """A closed stdin ends the chat rather than crashing"""
    chat = require("chat")
    set_input(["hello"])
    clear_output()
    try:
        replies = chat()
    except EOFError:
        raise AssertionError(
            "chat let EOFError escape. Catch it around input() and return what "
            "you have so far."
        )
    assert replies == ["Hello there!"], f"Got {replies}"
