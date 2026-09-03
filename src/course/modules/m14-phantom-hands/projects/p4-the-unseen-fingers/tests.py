import pyautogui

FIELDS = {"name": "Kira", "town": "Marrow Ford"}


def _reset():
    pyautogui.reset(width=1920, height=1080, fixtures={"submit.png": (500, 400)})


def test_counts_the_fields():
    """It reports how many boxes it filled"""
    fill_form = require("fill_form")
    _reset()
    assert fill_form(FIELDS, "submit.png") == 2, f"Got {fill_form(FIELDS, 'submit.png')!r}"


def test_types_every_value():
    """Each value is written"""
    fill_form = require("fill_form")
    _reset()
    fill_form(FIELDS, "submit.png")
    typed = [e["text"] for e in pyautogui.EVENTS if e["action"] == "write"]
    assert typed == ["Kira", "Marrow Ford"], f"The hands typed {typed}"


def test_tabs_between_fields():
    """It moves to the next box after each value"""
    fill_form = require("fill_form")
    _reset()
    fill_form(FIELDS, "submit.png")
    presses = [e for e in pyautogui.EVENTS if e["action"] == "press"]
    assert len(presses) == 2, f"It pressed a key {len(presses)} times; expected two tabs."
    assert presses[0]["keys"] == "tab", f"It pressed {presses[0]['keys']!r}"


def test_clicks_the_button():
    """The form is submitted where the button was found"""
    fill_form = require("fill_form")
    _reset()
    fill_form(FIELDS, "submit.png")
    clicks = [e for e in pyautogui.EVENTS if e["action"] == "click"]
    assert len(clicks) == 1, f"It clicked {len(clicks)} times."
    assert (clicks[0]["x"], clicks[0]["y"]) == (500, 400), (
        f"It clicked at {(clicks[0]['x'], clicks[0]['y'])}, not where the button is."
    )


def test_the_order_is_right():
    """Everything is typed before anything is submitted"""
    fill_form = require("fill_form")
    _reset()
    fill_form(FIELDS, "submit.png")
    actions = [e["action"] for e in pyautogui.EVENTS]
    assert actions.index("click") > max(i for i, a in enumerate(actions) if a == "write"), (
        f"The hands did {actions}. On a real screen, clicking submit before the last "
        "value is typed sends a half-filled form."
    )


def test_missing_button_refuses():
    """A button that is not there is worth stopping for"""
    fill_form = require("fill_form")
    _reset()
    try:
        fill_form(FIELDS, "nowhere.png")
    except ValueError as exc:
        assert "nowhere.png" in str(exc), (
            f"The message was {str(exc)!r}; naming the image is what makes the log useful."
        )
        clicks = [e for e in pyautogui.EVENTS if e["action"] == "click"]
        assert not clicks, "It clicked anyway. A button that was not found must not be clicked."
        return
    raise AssertionError(
        "A missing button returned quietly. locateCenterOnScreen gives None, and "
        "clicking None is a TypeError from deep inside the library — raise something "
        "that names the file instead."
    )
