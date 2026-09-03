def test_add_modifies_in_place():
    """add_task appends to the list it was given"""
    add_task = require("add_task")
    tasks = []
    add_task(tasks, "buy rope")
    add_task(tasks, "oil the hinge")
    assert tasks == ["buy rope", "oil the hinge"], (
        f"Expected ['buy rope', 'oil the hinge'] but the list holds {tasks}. "
        "Append to the list you were passed rather than making a new one."
    )


def test_add_rejects_junk():
    """Blank and duplicate tasks are ignored"""
    add_task = require("add_task")
    tasks = ["buy rope"]
    add_task(tasks, "buy rope")
    add_task(tasks, "")
    add_task(tasks, "   ")
    assert tasks == ["buy rope"], f"Expected ['buy rope'] but got {tasks}"


def test_complete_reports_back():
    """complete_task removes the task and says whether it found one"""
    complete_task = require("complete_task")
    tasks = ["buy rope", "oil the hinge"]
    assert complete_task(tasks, "buy rope") is True, "Should return True when it removes something."
    assert tasks == ["oil the hinge"], f"After removing, the list holds {tasks}"
    assert complete_task(tasks, "feed the dragon") is False, (
        "Removing a task that is not there should return False."
    )
    assert tasks == ["oil the hinge"], "A failed removal must not change the list."


def test_complete_never_crashes():
    """Completing from an empty list is safe"""
    complete_task = require("complete_task")
    try:
        assert complete_task([], "anything") is False
    except ValueError:
        raise AssertionError(
            "complete_task raised ValueError. Check `if description in tasks` "
            "before calling .remove()."
        )
