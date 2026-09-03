import os

SCRATCH = "/tmp/day20"


def _path(name):
    os.makedirs(SCRATCH, exist_ok=True)
    path = os.path.join(SCRATCH, name)
    if os.path.exists(path):
        os.remove(path)
    return path


def test_record_day():
    """record_day counts up and returns the new total"""
    record_day = require("record_day")
    habits = {}
    assert record_day(habits, "reading") == 1, "A brand new habit starts at 1."
    assert record_day(habits, "reading") == 2
    assert habits == {"reading": 2}, f"Got {habits!r}"


def test_full_cycle():
    """Load, record, save, reload — the whole point of the exercise"""
    load_habits = require("load_habits")
    record_day = require("record_day")
    save_habits = require("save_habits")
    path = _path("cycle.txt")
    habits = load_habits(path)
    record_day(habits, "reading")
    record_day(habits, "reading")
    record_day(habits, "art")
    save_habits(path, habits)
    assert load_habits(path) == {"reading": 2, "art": 1}, f"Got {load_habits(path)!r}"


def test_streak_report():
    """The report ranks by count, then alphabetically"""
    streak_report = require("streak_report")
    result = streak_report({"reading": 12, "exercise": 5, "art": 12})
    assert result == ["art: 12 days", "reading: 12 days", "exercise: 5 days"], f"Got {result}"
    assert streak_report({}) == [], "An empty tracker reports nothing."
