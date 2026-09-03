def test_london():
    """fetch_weather flattens the API response"""
    fetch_weather = require("fetch_weather")
    data = fetch_weather("London")
    assert data is not None, (
        "fetch_weather('London') returned None. London is one of the cities the "
        "API knows about, so the status should have been 200."
    )
    assert isinstance(data, dict), f"Expected a dict, got {type(data).__name__}."
    assert data == {
        "city": "London",
        "country": "United Kingdom",
        "temp_c": 12.5,
        "condition": "Light rain",
        "humidity": 82,
    }, f"Got {data!r}"


def test_other_cities():
    """The city is passed through to the API rather than hard-coded"""
    fetch_weather = require("fetch_weather")
    tokyo = fetch_weather("Tokyo")
    assert tokyo["city"] == "Tokyo" and tokyo["temp_c"] == 26.0, f"Got {tokyo!r}"
    reykjavik = fetch_weather("Reykjavik")
    assert reykjavik["condition"] == "Blowing snow", f"Got {reykjavik!r}"


def test_condition_is_unwrapped():
    """condition is the text, not the dict around it"""
    fetch_weather = require("fetch_weather")
    condition = fetch_weather("Tokyo")["condition"]
    assert condition == "Sunny", (
        f"condition came back as {condition!r}. It is nested one level deeper: "
        'data["current"]["condition"]["text"].'
    )


def test_unknown_city():
    """A 404 gives None, not a crash"""
    fetch_weather = require("fetch_weather")
    try:
        result = fetch_weather("Atlantis")
    except Exception as exc:
        raise AssertionError(
            f"fetch_weather('Atlantis') raised {type(exc).__name__}: {exc}. "
            "Check response.status_code before you call .json()."
        )
    assert result is None, f"An unknown city should give None, got {result!r}"


def test_describe():
    """describe_weather formats one readable line"""
    describe_weather = require("describe_weather")
    fetch_weather = require("fetch_weather")
    line = describe_weather(fetch_weather("London"))
    assert line == "London, United Kingdom: 12.5°C, Light rain (82% humidity)", (
        f"Got {line!r}"
    )


def test_describe_handles_none():
    """describe_weather copes with a failed lookup"""
    describe_weather = require("describe_weather")
    try:
        result = describe_weather(None)
    except Exception as exc:
        raise AssertionError(
            f"describe_weather(None) raised {type(exc).__name__}. Check for None first."
        )
    assert result == "Weather unavailable.", f"Got {result!r}"


def test_uses_requests():
    """The data comes from requests.get"""
    import requests

    calls = []
    original = requests.get

    def spy(url, **kwargs):
        calls.append((url, kwargs))
        return original(url, **kwargs)

    requests.get = spy
    try:
        require("fetch_weather")("London")
    finally:
        requests.get = original

    assert calls, "fetch_weather did not call requests.get."
    url, kwargs = calls[0]
    assert "weather" in str(url), f"requests.get was called with {url!r}"
    sent = kwargs.get("params") or {}
    assert sent.get("city") == "London" or "London" in str(url), (
        "The city never reached the API — pass params={'city': city} to requests.get."
    )
