## The situation

A page is loaded in `NEWS_HTML`. Nobody wrote it for you — it was written for a
reader, with a masthead and a navigation bar and a footer, and somewhere in the
middle of all that is the thing you want.

Look into the glass and take only that.

## What good looks like

```python
scrape_headlines(NEWS_HTML)
# ['Python turns 35',
#  'Local developer discovers f-strings',
#  'Semicolons found in Python file']

scrape_links(NEWS_HTML)
# ['/', '/about', '/news/python-35', '/news/f-strings', '/news/semicolons', '/contact']

scrape_headlines(EMPTY_HTML)
# []
```

## Your objective

**`scrape_headlines(html)`** — every `<h2>`'s text, stripped, in page order.

**`scrape_links(html)`** — the `href` of every `<a>` on the page, in order.
Anchors with no `href` are skipped, not crashed on.

## Watch out for

`get_text()` on its own gives you the HTML's indentation and newlines as part of
the text. `get_text(strip=True)` is what you want almost every time.

`anchor["href"]` raises `KeyError` when the attribute is missing.
`anchor.get("href")` gives `None`, which you can test. On a page you do not
control, assume every attribute might be absent.
