import time

import requests

URL = "https://api.example.com/weather?city=London"


def _flaky(fail_times):
    """A service that fails a set number of times, then recovers."""
    state = {"calls": 0}
    real = requests.get

    def fake(url, **kwargs):
        state["calls"] += 1
        if state["calls"] <= fail_times:
            raise requests.RequestException("connection reset")
        return real(url, **kwargs)

    return fake, state


def _no_sleeping():
    """Record the delays instead of actually waiting for them."""
    slept = []
    original = time.sleep
    time.sleep = lambda seconds: slept.append(seconds)
    return slept, original


def test_first_time_lucky():
    """A working service is called once"""
    fetch_with_retry = require("fetch_with_retry")
    slept, original = _no_sleeping()
    try:
        result = fetch_with_retry(URL, attempts=3)
    finally:
        time.sleep = original
    assert result["ok"] is True, f"Got {result}"
    assert result["attempts"] == 1, f"Got {result['attempts']} attempts for a call that worked."
    assert result["data"]["location"]["name"] == "London", f"Got {result['data']}"
    assert slept == [], f"It slept {slept} after a call that succeeded."


def test_recovers_after_failures():
    """Two failures then a success takes three attempts"""
    fetch_with_retry = require("fetch_with_retry")
    fake, _state = _flaky(2)
    slept, original_sleep = _no_sleeping()
    real_get = requests.get
    requests.get = fake
    try:
        result = fetch_with_retry(URL, attempts=3)
    finally:
        requests.get = real_get
        time.sleep = original_sleep
    assert result["ok"] is True, f"Got {result} — it should have recovered on the third try."
    assert result["attempts"] == 3, f"Got {result['attempts']} attempts."


def test_gives_up():
    """A service that never recovers is not called forever"""
    fetch_with_retry = require("fetch_with_retry")
    fake, state = _flaky(99)
    slept, original_sleep = _no_sleeping()
    real_get = requests.get
    requests.get = fake
    try:
        result = fetch_with_retry(URL, attempts=3)
    finally:
        requests.get = real_get
        time.sleep = original_sleep
    assert result == {"attempts": 3, "ok": False, "data": None}, f"Got {result}"
    assert state["calls"] == 3, f"It made {state['calls']} calls for attempts=3."


def test_backoff_doubles():
    """The wait doubles between attempts"""
    fetch_with_retry = require("fetch_with_retry")
    fake, _state = _flaky(99)
    slept, original_sleep = _no_sleeping()
    real_get = requests.get
    requests.get = fake
    try:
        fetch_with_retry(URL, attempts=4)
    finally:
        requests.get = real_get
        time.sleep = original_sleep
    assert slept == [1, 2, 4], (
        f"It waited {slept}. The delay should start at 1 and double: 1, 2, 4 — "
        "and there should be no sleep after the final attempt."
    )
