BANK = "/data/questions.txt"


def test_load_questions():
    """Questions load as (question, answer) pairs"""
    load_questions = require("load_questions")
    questions = load_questions(BANK)
    assert isinstance(questions, list), f"Expected a list, got {type(questions).__name__}."
    assert len(questions) == 4, f"The file holds four questions; you loaded {len(questions)}."
    assert questions[0] == ("What is the capital of France?", "Paris"), f"Got {questions[0]!r}"
    assert questions[2] == ("Which keyword defines a function in Python?", "def")


def test_load_skips_bad_lines():
    """Blank and separator-less lines are skipped"""
    load_questions = require("load_questions")
    try:
        questions = load_questions("/data/messy.txt")
    except Exception as exc:
        raise AssertionError(
            f"A malformed line crashed load_questions with {type(exc).__name__}: {exc}"
        )
    assert questions == [("Good question?", "Yes"), ("Another good one?", "Also yes")], (
        f"Got {questions!r}"
    )


def test_load_missing_file():
    """A missing question bank gives an empty quiz"""
    load_questions = require("load_questions")
    try:
        assert load_questions("/data/not-a-file.txt") == []
    except FileNotFoundError:
        raise AssertionError("load_questions should return [] when the file is missing.")
