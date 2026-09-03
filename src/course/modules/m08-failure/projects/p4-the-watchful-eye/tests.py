import os

LOG = "/workspace/run.log"


def _read():
    with open(LOG) as handle:
        return handle.read()


def _reset():
    if os.path.exists(LOG):
        os.remove(LOG)


def test_returns_the_total():
    """Negative amounts contribute nothing"""
    sum_takings = require("sum_takings")
    _reset()
    assert sum_takings([5, -2, 10], LOG) == 15, f"Got {sum_takings([5, -2, 10], LOG)!r}"


def test_writes_a_log_file():
    """The log reaches the disk"""
    sum_takings = require("sum_takings")
    _reset()
    sum_takings([5], LOG)
    assert os.path.exists(LOG), (
        "No log file appeared. Pass filename= to basicConfig, and force=True so it "
        "takes effect even if logging was configured earlier."
    )


def test_debug_lines_are_kept():
    """The level is low enough to record the detail"""
    sum_takings = require("sum_takings")
    _reset()
    sum_takings([5, 10], LOG)
    text = _read()
    assert "DEBUG: adding 5, running total 5" in text, f"The log holds:\n{text}"
    assert "DEBUG: adding 10, running total 15" in text, (
        f"The log holds:\n{text}\nAt the default level DEBUG lines are discarded."
    )


def test_warnings_for_negatives():
    """A skipped amount says so"""
    sum_takings = require("sum_takings")
    _reset()
    sum_takings([5, -2], LOG)
    assert "WARNING: skipping negative amount: -2" in _read(), f"The log holds:\n{_read()}"


def test_the_closing_line():
    """It records what it finished with"""
    sum_takings = require("sum_takings")
    _reset()
    sum_takings([5, 10], LOG)
    assert "INFO: finished with total 15" in _read(), f"The log holds:\n{_read()}"


def test_the_format():
    """Level, colon, message — and nothing else"""
    sum_takings = require("sum_takings")
    _reset()
    sum_takings([5], LOG)
    first = _read().strip().split("\n")[0]
    assert first.startswith("DEBUG: "), (
        f"The first line is {first!r}. The format should be "
        "'%(levelname)s: %(message)s' — no timestamp, no logger name."
    )


def test_runs_twice():
    """A second run writes its own log rather than nothing"""
    sum_takings = require("sum_takings")
    _reset()
    sum_takings([1], LOG)
    _reset()
    sum_takings([7], LOG)
    assert os.path.exists(LOG) and "total 7" in _read(), (
        "The second run produced no log. basicConfig does nothing on a second call "
        "unless you pass force=True."
    )
