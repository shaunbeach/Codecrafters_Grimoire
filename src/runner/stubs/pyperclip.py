"""A stand-in for pyperclip.

The real library talks to the operating system clipboard. A browser tab cannot,
and would need a user gesture even if it could. This keeps an in-memory
clipboard with the same two-function API, so multi-clipboard and
copy-transform-paste exercises work exactly as written.
"""

_CLIPBOARD = [""]

#: Every copy/paste in order, for the Stage to display.
EVENTS = []


class PyperclipException(Exception):
    pass


def copy(text):
    """Put text on the clipboard."""
    _CLIPBOARD[0] = str(text)
    EVENTS.append({"action": "copy", "text": _CLIPBOARD[0]})


def paste():
    """Return whatever is on the clipboard."""
    EVENTS.append({"action": "paste", "text": _CLIPBOARD[0]})
    return _CLIPBOARD[0]


def waitForPaste(timeout=None):
    return paste()


def waitForNewPaste(timeout=None):
    return paste()


def determine_clipboard():
    return copy, paste


def set_clipboard(name):
    return None


def is_available():
    return True


def reset(initial=""):
    """Clear the clipboard and log. Called by the harness before each run."""
    _CLIPBOARD[0] = initial
    EVENTS.clear()
