BANK = "/data/questions.txt"


def test_quiz_scores_correct_answers():
    """Right answers count"""
    run_quiz = require("run_quiz")
    set_input(["Paris", "4"])
    clear_output()
    score = run_quiz([("Capital of France?", "Paris"), ("2 + 2?", "4")])
    assert score == 2, f"Both answers were right but run_quiz returned {score!r}."
    assert get_output().count("Correct!") == 2, (
        f"Expected 'Correct!' twice. Your output was:\n{get_output()}"
    )


def test_quiz_reports_wrong_answers():
    """Wrong answers reveal the right one"""
    run_quiz = require("run_quiz")
    set_input(["Berlin"])
    clear_output()
    score = run_quiz([("Capital of France?", "Paris")])
    printed = get_output()
    assert score == 0, f"Expected a score of 0, got {score!r}"
    assert "Wrong — the answer was Paris." in printed, (
        "Expected the line 'Wrong — the answer was Paris.' (note the em dash "
        f"and the full stop). Your output was:\n{printed}"
    )


def test_quiz_is_forgiving():
    """Case and stray spaces do not lose you a point"""
    run_quiz = require("run_quiz")
    set_input(["  pArIs  ", "DEF"])
    score = run_quiz([("Capital of France?", "Paris"), ("Function keyword?", "def")])
    assert score == 2, (
        f"Expected 2 but got {score}. Compare answer.strip().lower() on both sides."
    )


def test_quiz_shows_the_questions():
    """The player can see what is being asked"""
    run_quiz = require("run_quiz")
    set_input(["Paris"])
    clear_output()
    run_quiz([("Capital of France?", "Paris")])
    assert "Capital of France?" in get_output(), (
        "The question text never reached the screen. Print it, or pass it to input()."
    )


def test_quiz_final_report():
    """The final line reports the score out of the total"""
    run_quiz = require("run_quiz")
    set_input(["Paris", "Berlin", "Rome"])
    clear_output()
    run_quiz([("a", "Paris"), ("b", "Paris"), ("c", "Paris")])
    assert "You scored 1/3." in get_output(), (
        f"Expected the line 'You scored 1/3.' Your output was:\n{get_output()}"
    )


def test_empty_quiz():
    """A quiz with no questions scores zero without crashing"""
    run_quiz = require("run_quiz")
    set_input([])
    clear_output()
    try:
        score = run_quiz([])
    except Exception as exc:
        raise AssertionError(f"An empty quiz raised {type(exc).__name__}: {exc}")
    assert score == 0, f"Expected 0, got {score!r}"
    assert "You scored 0/0." in get_output(), f"Your output was:\n{get_output()}"
