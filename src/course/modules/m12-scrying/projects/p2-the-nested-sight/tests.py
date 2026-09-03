HEADLINES = [
    "Python turns 35",
    "Local developer discovers f-strings",
    "Semicolons found in Python file",
]


def test_stories_shape():
    """Each story is a dict with headline, summary and link"""
    scrape_stories = require("scrape_stories")
    stories = scrape_stories(NEWS_HTML)
    assert len(stories) == 3, f"Expected three stories, got {len(stories)}."
    assert set(stories[0]) == {"headline", "summary", "link"}, (
        f"Expected the keys headline/summary/link, got {sorted(stories[0])}"
    )


def test_stories_content():
    """The three fields belong to the same story"""
    scrape_stories = require("scrape_stories")
    stories = scrape_stories(NEWS_HTML)
    assert stories[0] == {
        "headline": "Python turns 35",
        "summary": "The language nobody expected to last is still growing.",
        "link": "/news/python-35",
    }, f"Got {stories[0]}"
    assert stories[2]["link"] == "/news/semicolons", (
        f"The third story's link is {stories[2]['link']!r}. Search inside each "
        "article rather than collecting every link on the page."
    )


def test_stories_on_an_empty_page():
    """No articles means no stories"""
    scrape_stories = require("scrape_stories")
    assert scrape_stories(EMPTY_HTML) == [], f"Got {scrape_stories(EMPTY_HTML)}"


def test_stories_tolerate_missing_pieces():
    """A half-built article does not bring the scraper down"""
    scrape_stories = require("scrape_stories")
    html = '<html><body><article class="story"><h2>Only a headline</h2></article></body></html>'
    try:
        stories = scrape_stories(html)
    except AttributeError:
        raise AssertionError(
            "scrape_stories crashed on an article with no summary or link. "
            "find() returns None when there is no match — check for it."
        )
    assert stories == [{"headline": "Only a headline", "summary": "", "link": ""}], (
        f"Got {stories}"
    )
