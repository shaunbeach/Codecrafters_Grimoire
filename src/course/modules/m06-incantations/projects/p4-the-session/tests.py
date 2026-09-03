def test_session_returns_store_and_responses():
    """run_session replays a whole script"""
    run_session = require("run_session")
    result = run_session(["set gold 50", "add gold 20", "list"])
    assert isinstance(result, tuple) and len(result) == 2, (
        f"run_session should return a (store, responses) tuple, got {result!r}"
    )
    store, responses = result
    assert store == {"gold": 70}, f"Expected {{'gold': 70}}, got {store}"
    assert responses == ["gold = 50", "gold = 70", "gold"], f"Got {responses}"


def test_session_starts_empty():
    """Each session starts from a fresh dictionary"""
    run_session = require("run_session")
    run_session(["set gold 50"])
    store, _ = run_session(["list"])
    assert store == {}, (
        f"A new session should start empty but found {store}. Create the dict "
        "inside run_session, not at module level."
    )
