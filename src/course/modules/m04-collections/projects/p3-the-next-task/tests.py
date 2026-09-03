def test_next_task_pops_the_front():
    """next_task removes and returns the first task"""
    next_task = require("next_task")
    tasks = ["first", "second"]
    assert next_task(tasks) == "first", "It should hand back the first task."
    assert tasks == ["second"], f"After popping, the list should be ['second'], got {tasks}"
    assert next_task(["only"]) == "only"


def test_next_task_on_empty():
    """An empty list gives None, not an error"""
    next_task = require("next_task")
    try:
        assert next_task([]) is None
    except IndexError:
        raise AssertionError(
            "next_task raised IndexError on an empty list. Check the list is "
            "non-empty before calling .pop()."
        )


def test_pending_is_numbered_and_pure():
    """pending_tasks numbers from 1 and leaves the original alone"""
    pending_tasks = require("pending_tasks")
    tasks = ["buy rope", "oil the hinge"]
    result = pending_tasks(tasks)
    assert result == ["1. buy rope", "2. oil the hinge"], f"Got {result}"
    assert tasks == ["buy rope", "oil the hinge"], (
        f"pending_tasks changed the original list — it now holds {tasks}."
    )
    assert pending_tasks([]) == []
