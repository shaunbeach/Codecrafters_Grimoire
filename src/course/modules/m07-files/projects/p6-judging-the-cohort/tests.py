GRADES = "/data/grades.csv"


def test_average():
    """class_average averages one column"""
    class_average = require("class_average")
    parse_csv = require("parse_csv")
    rows = parse_csv(GRADES)
    assert class_average(rows, "maths") == 78.5, f"Got {class_average(rows, 'maths')}"
    assert class_average(rows, "science") == 82.0, f"Got {class_average(rows, 'science')}"


def test_average_is_rounded():
    """Averages come back rounded to two places"""
    class_average = require("class_average")
    rows = [{"x": "1"}, {"x": "2"}, {"x": "2"}]
    assert class_average(rows, "x") == 1.67, (
        f"Got {class_average(rows, 'x')} — round the result to 2 decimal places."
    )


def test_average_of_nothing():
    """An empty list of rows averages to 0.0, not a crash"""
    class_average = require("class_average")
    try:
        result = class_average([], "maths")
    except ZeroDivisionError:
        raise AssertionError(
            "class_average divided by zero on an empty list. Check `if not rows` first."
        )
    assert result == 0.0, f"Expected 0.0, got {result}"


def test_top_student():
    """top_student finds the best all-rounder"""
    top_student = require("top_student")
    parse_csv = require("parse_csv")
    rows = parse_csv(GRADES)
    assert top_student(rows) == "Ana", (
        f"Got {top_student(rows)!r}. Ana averages 95, the highest in the file."
    )


def test_top_student_ignores_the_name_column():
    """The name column is not a score"""
    top_student = require("top_student")
    rows = [
        {"name": "Zed", "a": "10", "b": "10"},
        {"name": "Amy", "a": "90", "b": "90"},
    ]
    try:
        result = top_student(rows)
    except ValueError:
        raise AssertionError(
            "top_student tried to convert a student's name to a number. "
            "Skip the 'name' key when you average the scores."
        )
    assert result == "Amy", f"Got {result!r}"
