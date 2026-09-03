"""A stand-in for pyautogui.

The real library drives a physical mouse and keyboard, which a browser tab
cannot do and should not be able to do. This stub has the same call signatures
and records every action into a log, so a program written against it is real
pyautogui code — and so the course can *show* where the clicks landed instead of
just asserting that they happened.

Anything not implemented here raises a clear error naming the missing function,
rather than an AttributeError from somewhere deep in a call stack.
"""

import time as _time

# --- module-level settings the real library exposes -------------------------

PAUSE = 0.0
FAILSAFE = True
FAILSAFE_POINTS = [(0, 0)]

_SCREEN = [1920, 1080]
_CURSOR = [960, 540]

#: Every action, in order. The Stage renders this; tests can assert on it.
EVENTS = []

#: Images that locateOnScreen-style calls should "find", keyed by filename.
#: A course project seeds this from its setup, e.g. {"submit.png": (500, 400)}.
SCREEN_FIXTURES = {}


class PyAutoGUIException(Exception):
    """Base class for this module's errors, as in the real library."""


class FailSafeException(PyAutoGUIException):
    pass


class ImageNotFoundException(PyAutoGUIException):
    pass


def _record(action, **details):
    event = {"action": action, "at": round(_time.time(), 6), **details}
    EVENTS.append(event)
    return event


def _clamp(x, y):
    return (
        max(0, min(int(x), _SCREEN[0] - 1)),
        max(0, min(int(y), _SCREEN[1] - 1)),
    )


def reset(width=1920, height=1080, fixtures=None):
    """Clear the log and cursor. Called by the harness before each run."""
    EVENTS.clear()
    SCREEN_FIXTURES.clear()
    if fixtures:
        SCREEN_FIXTURES.update(fixtures)
    _SCREEN[:] = [width, height]
    _CURSOR[:] = [width // 2, height // 2]


# --- screen -----------------------------------------------------------------

def size():
    return (_SCREEN[0], _SCREEN[1])


def position():
    return (_CURSOR[0], _CURSOR[1])


def onScreen(x, y):
    return 0 <= x < _SCREEN[0] and 0 <= y < _SCREEN[1]


def screenshot(imageFilename=None, region=None):
    """Write a plausible screenshot if Pillow is available; else record only."""
    _record("screenshot", path=imageFilename, region=region)
    if imageFilename is None:
        return None
    try:
        from PIL import Image
    except ImportError:
        return None
    width, height = (region[2], region[3]) if region else size()
    image = Image.new("RGB", (max(1, width), max(1, height)), (24, 26, 34))
    image.save(imageFilename)
    return image


# --- mouse ------------------------------------------------------------------

def moveTo(x=None, y=None, duration=0.0):
    if x is not None and y is not None:
        _CURSOR[:] = _clamp(x, y)
    _record("moveTo", x=_CURSOR[0], y=_CURSOR[1], duration=duration)


def moveRel(xOffset=0, yOffset=0, duration=0.0):
    _CURSOR[:] = _clamp(_CURSOR[0] + xOffset, _CURSOR[1] + yOffset)
    _record("moveRel", x=_CURSOR[0], y=_CURSOR[1], duration=duration)


move = moveRel


def click(x=None, y=None, clicks=1, interval=0.0, button="left", duration=0.0):
    # The real API accepts click((x, y)) as well as click(x, y).
    if isinstance(x, (tuple, list)) and y is None:
        x, y = x[0], x[1]
    if x is not None and y is not None:
        _CURSOR[:] = _clamp(x, y)
    _record("click", x=_CURSOR[0], y=_CURSOR[1], clicks=clicks, button=button)


def doubleClick(x=None, y=None, interval=0.0, button="left", duration=0.0):
    click(x, y, clicks=2, button=button)


def rightClick(x=None, y=None, duration=0.0):
    click(x, y, button="right")


def middleClick(x=None, y=None, duration=0.0):
    click(x, y, button="middle")


def mouseDown(x=None, y=None, button="left", duration=0.0):
    if x is not None and y is not None:
        _CURSOR[:] = _clamp(x, y)
    _record("mouseDown", x=_CURSOR[0], y=_CURSOR[1], button=button)


def mouseUp(x=None, y=None, button="left", duration=0.0):
    if x is not None and y is not None:
        _CURSOR[:] = _clamp(x, y)
    _record("mouseUp", x=_CURSOR[0], y=_CURSOR[1], button=button)


def dragTo(x=None, y=None, duration=0.0, button="left"):
    start = (_CURSOR[0], _CURSOR[1])
    if x is not None and y is not None:
        _CURSOR[:] = _clamp(x, y)
    _record("dragTo", fromX=start[0], fromY=start[1], x=_CURSOR[0], y=_CURSOR[1], button=button)


def dragRel(xOffset=0, yOffset=0, duration=0.0, button="left"):
    dragTo(_CURSOR[0] + xOffset, _CURSOR[1] + yOffset, duration=duration, button=button)


drag = dragRel


def scroll(clicks, x=None, y=None):
    _record("scroll", clicks=clicks, x=_CURSOR[0], y=_CURSOR[1])


def hscroll(clicks, x=None, y=None):
    _record("hscroll", clicks=clicks, x=_CURSOR[0], y=_CURSOR[1])


# --- keyboard ---------------------------------------------------------------

def write(message, interval=0.0):
    _record("write", text=str(message))


typewrite = write


def press(keys, presses=1, interval=0.0):
    for _ in range(presses):
        _record("press", keys=keys if isinstance(keys, str) else list(keys))


def keyDown(key):
    _record("keyDown", key=key)


def keyUp(key):
    _record("keyUp", key=key)


def hotkey(*keys, interval=0.0):
    _record("hotkey", keys=list(keys))


# --- locating ---------------------------------------------------------------

def locateOnScreen(image, confidence=None, region=None, grayscale=False):
    """Return a (left, top, width, height) box for a seeded fixture."""
    found = SCREEN_FIXTURES.get(image)
    _record("locateOnScreen", image=image, found=found is not None)
    if found is None:
        raise ImageNotFoundException(f"Could not locate {image!r} on the screen")
    if len(found) == 4:
        return tuple(found)
    return (found[0] - 25, found[1] - 12, 50, 24)


def locateCenterOnScreen(image, confidence=None, region=None, grayscale=False):
    """Return an (x, y) centre, or None when the image is not on screen.

    The real library returns None here rather than raising, which is why the
    exercises written against it test for None.
    """
    found = SCREEN_FIXTURES.get(image)
    _record("locateCenterOnScreen", image=image, found=found is not None)
    if found is None:
        return None
    if len(found) == 4:
        return (found[0] + found[2] // 2, found[1] + found[3] // 2)
    return (found[0], found[1])


def locateAllOnScreen(image, confidence=None, region=None, grayscale=False):
    found = SCREEN_FIXTURES.get(image)
    _record("locateAllOnScreen", image=image, found=found is not None)
    return iter([] if found is None else [locateOnScreen(image)])


def pixel(x, y):
    return (0, 0, 0)


def pixelMatchesColor(x, y, expectedRGBColor, tolerance=0):
    return False


# --- dialogs ----------------------------------------------------------------

def alert(text="", title="", button="OK"):
    _record("alert", text=text, title=title)
    return button


def confirm(text="", title="", buttons=("OK", "Cancel")):
    _record("confirm", text=text, title=title)
    return buttons[0]


def prompt(text="", title="", default=""):
    _record("prompt", text=text, title=title)
    return default


def password(text="", title="", default="", mask="*"):
    _record("password", text=text, title=title)
    return default


def sleep(seconds):
    _record("sleep", seconds=seconds)


def __getattr__(name):
    raise AttributeError(
        f"pyautogui.{name} is not available in the browser. This course ships a "
        "stand-in for pyautogui that records what your program would have done. "
        "If you need this function for a project, say so — it can be added."
    )
