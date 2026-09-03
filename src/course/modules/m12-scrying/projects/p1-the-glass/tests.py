HEADLINES = [
    "Python turns 35",
    "Local developer discovers f-strings",
    "Semicolons found in Python file",
]


def test_headlines():
    """Every h2 is found, in page order, with whitespace stripped"""
    scrape_headlines = require("scrape_headlines")
    result = scrape_headlines(NEWS_HTML)
    assert isinstance(result, list), f"Expected a list, got {type(result).__name__}."
    assert result == HEADLINES, (
        f"Got {result}. Use get_text(strip=True) — the HTML indentation "
        "becomes part of the text otherwise."
    )


def test_headlines_on_an_empty_page():
    """A page with no h2 gives an empty list"""
    scrape_headlines = require("scrape_headlines")
    assert scrape_headlines(EMPTY_HTML) == [], f"Got {scrape_headlines(EMPTY_HTML)}"


def test_links():
    """Every anchor's href is collected, including the nav and footer"""
    scrape_links = require("scrape_links")
    result = scrape_links(NEWS_HTML)
    assert result == [
        "/",
        "/about",
        "/news/python-35",
        "/news/f-strings",
        "/news/semicolons",
        "/contact",
    ], f"Got {result}"


def test_links_skip_anchors_without_href():
    """A link with no href is skipped, not crashed on"""
    scrape_links = require("scrape_links")
    html = '<html><body><a>no href</a><a href="/real">real</a></body></html>'
    try:
        result = scrape_links(html)
    except KeyError:
        raise AssertionError(
            "scrape_links raised KeyError on an anchor with no href. "
            'Use anchor.get("href") rather than anchor["href"].'
        )
    assert result == ["/real"], f"Got {result}"
