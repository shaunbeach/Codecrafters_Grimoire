def test_plan_keys():
    """PROJECT_PLAN has the four required keys"""
    plan = require("PROJECT_PLAN", "variable")
    assert isinstance(plan, dict), f"PROJECT_PLAN should be a dict, got {type(plan).__name__}."
    assert set(plan) == {"name", "goal", "files", "milestones"}, (
        f"Expected the keys name/goal/files/milestones, got {sorted(plan)}"
    )


def test_plan_is_filled_in():
    """The name and goal are yours, and actually written"""
    plan = require("PROJECT_PLAN", "variable")
    assert isinstance(plan["name"], str) and plan["name"].strip(), (
        "Give your project a name — the starter leaves it empty."
    )
    assert isinstance(plan["goal"], str) and len(plan["goal"].strip()) >= 30, (
        f"The goal is {len(str(plan['goal']).strip())} characters. Write one full "
        "sentence (at least 30) describing what the program is for."
    )


def test_plan_files():
    """At least three Python files are planned"""
    plan = require("PROJECT_PLAN", "variable")
    files = plan["files"]
    assert isinstance(files, list), f"files should be a list, got {type(files).__name__}."
    assert len(files) >= 3, f"Plan at least three files; you listed {len(files)}."
    for name in files:
        assert isinstance(name, str) and name.endswith(".py"), (
            f"{name!r} is not a Python filename — each entry should end in .py"
        )
    assert len(set(files)) == len(files), f"There is a duplicate filename in {files}."


def test_plan_milestones():
    """At least three milestones, in build order"""
    plan = require("PROJECT_PLAN", "variable")
    milestones = plan["milestones"]
    assert isinstance(milestones, list), f"milestones should be a list, got {type(milestones).__name__}."
    assert len(milestones) >= 3, f"List at least three milestones; you gave {len(milestones)}."
    for step in milestones:
        assert isinstance(step, str) and step.strip(), f"{step!r} is not a written milestone."


def test_state_shape():
    """new_game_state returns the agreed keys"""
    new_game_state = require("new_game_state")
    state = new_game_state()
    assert isinstance(state, dict), f"Expected a dict, got {type(state).__name__}."
    assert set(state) == {"room", "inventory", "visited", "moves"}, (
        f"Expected the keys room/inventory/visited/moves, got {sorted(state)}"
    )


def test_state_values():
    """A new game starts empty, in a real room"""
    new_game_state = require("new_game_state")
    state = new_game_state()
    assert isinstance(state["room"], str) and state["room"].strip(), (
        f"room should be a non-empty string naming where the player starts, got {state['room']!r}"
    )
    assert state["inventory"] == [], f"A new game starts with nothing carried, got {state['inventory']!r}"
    assert state["visited"] == [state["room"]], (
        f"visited should start as [{state['room']!r}], got {state['visited']!r}"
    )
    assert state["moves"] == 0, f"moves should start at 0, got {state['moves']!r}"


def test_states_are_independent():
    """Every call builds a brand new game"""
    new_game_state = require("new_game_state")
    first = new_game_state()
    second = new_game_state()
    first["inventory"].append("rope")
    first["moves"] = 99
    assert second["inventory"] == [], (
        "Changing one game changed another. Build the dict inside the function "
        "rather than returning a shared module-level one."
    )
    assert second["moves"] == 0


def test_stubs_exist_and_refuse():
    """The stubs are named, documented and refuse to run"""
    new_game_state = require("new_game_state")
    state = new_game_state()
    for name, args in [("look", (state,)), ("move", (state, "north")), ("take", (state, "rope"))]:
        function = require(name)
        assert callable(function), f"{name} should be a function."
        assert (function.__doc__ or "").strip(), (
            f"{name} has no docstring. Say what it will do before you write it."
        )
        try:
            function(*args)
        except NotImplementedError:
            continue
        except Exception as exc:
            raise AssertionError(
                f"{name} raised {type(exc).__name__} — it should raise NotImplementedError."
            )
        raise AssertionError(
            f"{name} returned instead of raising. A stub body of `pass` returns "
            "None silently; `raise NotImplementedError` fails loudly."
        )
