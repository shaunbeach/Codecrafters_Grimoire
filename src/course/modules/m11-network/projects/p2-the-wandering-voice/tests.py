KNOWN = [
    "My dog used to chase people on a bike a lot. It got so bad I had to take his bike away.",
    "Did you hear about the guy who invented the knock-knock joke? He won the no-bell prize.",
    "Why don't skeletons ever go trick or treating? Because they have nobody to go with.",
    "I don't trust stairs. They're always up to something.",
]


def test_fetch_returns_a_joke():
    """fetch_joke returns the joke text"""
    fetch_joke = require("fetch_joke")
    joke = fetch_joke()
    assert joke is not None, (
        "fetch_joke returned None. This API answers 406 unless you send "
        "headers={'Accept': 'application/json'}."
    )
    assert isinstance(joke, str), f"Expected a string, got {type(joke).__name__}."
    assert joke in KNOWN, (
        f"Got {joke!r}. Return data['joke'] — the text itself, not the whole payload."
    )


def test_jokes_vary():
    """A new call gets a new joke"""
    fetch_joke = require("fetch_joke")
    seen = {fetch_joke() for _ in range(60)}
    assert len(seen) > 1, (
        "Every call returned the same joke. Make the request inside the "
        "function rather than caching one at import time."
    )


def test_sends_accept_header():
    """The Accept header is set"""
    import requests

    calls = []
    original = requests.get

    def spy(url, **kwargs):
        calls.append(kwargs)
        return original(url, **kwargs)

    requests.get = spy
    try:
        require("fetch_joke")()
    finally:
        requests.get = original

    assert calls, "fetch_joke did not call requests.get."
    headers = calls[0].get("headers") or {}
    accept = {key.lower(): str(value).lower() for key, value in headers.items()}.get("accept", "")
    assert "application/json" in accept, (
        f"The headers sent were {headers!r}. This API needs "
        "Accept: application/json."
    )


def test_handles_a_bad_status():
    """A non-200 answer becomes None"""
    import requests

    original = requests.get
    requests.get = lambda url, **kwargs: requests.Response(500, {"message": "boom"})
    try:
        result = require("fetch_joke")()
    except Exception as exc:
        requests.get = original
        raise AssertionError(f"A 500 response raised {type(exc).__name__}: {exc}")
    finally:
        requests.get = original
    assert result is None, f"A 500 should give None, got {result!r}"


def test_handles_a_thrown_exception():
    """A network failure becomes None, not a traceback"""
    import requests

    def explode(url, **kwargs):
        raise requests.RequestException("connection reset")

    original = requests.get
    requests.get = explode
    try:
        result = require("fetch_joke")()
    except Exception as exc:
        raise AssertionError(
            f"fetch_joke let {type(exc).__name__} escape. Wrap the call in "
            "try/except requests.RequestException."
        )
    finally:
        requests.get = original
    assert result is None, f"Expected None after a failed request, got {result!r}"


def test_format_wraps():
    """format_joke wraps at the given width and indents"""
    format_joke = require("format_joke")
    joke = "I don't trust stairs. They're always up to something."
    result = format_joke(joke, width=30)
    lines = result.split("\n")
    assert len(lines) > 1, f"A 53-character joke should wrap at width 30. Got {result!r}"
    for line in lines:
        assert line.startswith("  "), f"Every line should be indented by two spaces: {line!r}"
        assert len(line) <= 32, f"This line is {len(line)} characters, over the 30 + 2 budget: {line!r}"


def test_format_keeps_words_whole():
    """No word is cut in half"""
    format_joke = require("format_joke")
    joke = "Why don't skeletons ever go trick or treating? Because they have nobody to go with."
    result = format_joke(joke, width=25)
    rebuilt = " ".join(line.strip() for line in result.split("\n"))
    assert rebuilt == joke, (
        f"Unwrapping the lines should give the original joke back, got {rebuilt!r}. "
        "textwrap.wrap only breaks between words."
    )


def test_format_handles_nothing():
    """No joke is still formatted politely"""
    format_joke = require("format_joke")
    assert format_joke(None) == "  (no joke today)", f"Got {format_joke(None)!r}"
    assert format_joke("") == "  (no joke today)", f"Got {format_joke('')!r}"
