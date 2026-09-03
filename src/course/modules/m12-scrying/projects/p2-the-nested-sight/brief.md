## The situation

Headlines and links, separately, are two lists you have to hope line up.

They will not. One story will be missing its link, everything after it will pair
with the wrong headline, and nothing will raise — the data will simply be wrong,
and it will be wrong in your database before anyone notices.

Search **inside** each story instead, and the pairing cannot drift.

## What good looks like

```python
scrape_stories(NEWS_HTML)[0]
# {'headline': 'Python turns 35',
#  'summary': 'The language nobody expected to last is still growing.',
#  'link': '/news/python-35'}

len(scrape_stories(NEWS_HTML))     # 3
scrape_stories(EMPTY_HTML)         # []
```

A half-built article, which real pages are full of:

```python
scrape_stories('<article class="story"><h2>Only a headline</h2></article>')
# [{'headline': 'Only a headline', 'summary': '', 'link': ''}]
```

## Your objective

**`scrape_stories(html)`** — one dictionary per `<article class="story">`, with
`headline`, `summary` and `link`.

Missing pieces become `''` rather than raising. A page with no articles gives
`[]`.

## Watch out for

`find` returns `None` when there is nothing there, and `None.get_text()` is an
`AttributeError`. Every one of the three lookups needs checking, because a page
you do not control will eventually be missing any of them.

The summary is a `<p class="summary">`, not just any paragraph.
