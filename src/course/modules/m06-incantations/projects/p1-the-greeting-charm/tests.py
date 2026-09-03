def test_plain_greeting():
    """greet('Kira') is 'Hello, Kira.'"""
    greet = require("greet")
    assert greet("Kira") == "Hello, Kira.", f"Got {greet('Kira')!r}"


def test_title_is_optional():
    """A title slots in before the name"""
    greet = require("greet")
    assert greet("Kira", "Captain") == "Hello, Captain Kira.", f"Got {greet('Kira', 'Captain')!r}"
    assert greet("Bo", title="Doctor") == "Hello, Doctor Bo.", (
        "The title should work as a keyword argument too."
    )


def test_excited_without_title():
    """excited=True shouts, and the full stop becomes a bang"""
    greet = require("greet")
    result = greet("Kira", excited=True)
    assert result == "HELLO, KIRA!", (
        f"Got {result!r}. Expected 'HELLO, KIRA!' — note there is no stray "
        "space where the empty title would be."
    )


def test_excited_with_title():
    """Both options at once"""
    greet = require("greet")
    assert greet("Kira", "Captain", True) == "HELLO, CAPTAIN KIRA!", (
        f"Got {greet('Kira', 'Captain', True)!r}"
    )


def test_defaults_are_declared():
    """title and excited really are optional"""
    greet = require("greet")
    try:
        greet("Kira")
    except TypeError as exc:
        raise AssertionError(
            f"Calling greet with just a name failed: {exc}. "
            "Give title and excited default values in the signature."
        )


def test_shout_all():
    """shout_all greets everybody excitedly"""
    shout_all = require("shout_all")
    assert shout_all(["Kira", "Bo"]) == ["HELLO, KIRA!", "HELLO, BO!"], f"Got {shout_all(['Kira', 'Bo'])}"
    assert shout_all([]) == [], "An empty list of names gives an empty list of greetings."


def test_shout_all_reuses_greet():
    """shout_all calls greet rather than duplicating it"""
    original = require("shout_all")
    calls = []

    def spy(name, title="", excited=False):
        calls.append((name, title, excited))
        return "spied"

    real_greet = globals()["greet"]
    globals()["greet"] = spy
    try:
        result = original(["Kira"])
    finally:
        globals()["greet"] = real_greet

    assert calls, (
        "shout_all did not call greet. Reuse it instead of rebuilding the "
        "greeting logic a second time."
    )
    assert calls[0][0] == "Kira" and calls[0][2] is True, (
        f"shout_all called greet with {calls[0]} — it should pass excited=True."
    )
