## The situation

A scraper is built on somebody else's layout, so it **will** break. Not if —
when. They will rename a class in a redesign and never tell you.

The question is what happens on that day. A scraper that returns `[]` looks like
"there is nothing for sale today", flows into your report as a zero, and is
believed. A scraper that says *"the price selector matched nothing"* is fixed in
ten minutes.

## What good looks like

```python
scrape_prices(SHOP_HTML)
# [{'name': 'Rope', 'price': 4.5}, {'name': 'Lantern', 'price': 12.0},
#  {'name': 'Coin pouch', 'price': 2.25}]

scrape_prices(EMPTY_SHOP_HTML)
# LookupError: no elements matched li.item — the page layout may have changed
```

An item whose price cannot be read is skipped, and the rest still come back:

```python
scrape_prices(BROKEN_SHOP_HTML)
# [{'name': 'Rope', 'price': 4.5}]
```

## Your objective

**`scrape_prices(html)`** — return one dict per `<li class="item">`, with `name`
(from `<span class="name">`) and `price` (from `<span class="price">`, as a
`float`, with the leading `£` removed).

- if **no** items match at all, raise `LookupError` with the message
  `no elements matched li.item — the page layout may have changed`
- an individual item missing a name or price, or with a price that will not
  convert, is **skipped** — one bad row does not lose you the page

## Watch out for

The distinction is the whole drill. **Nothing matched** means your assumptions
about the page are wrong and a human must look — that is worth raising over.
**One row is odd** is normal on a real page and worth skipping over.

Getting that the wrong way round gives you either a scraper that crashes on
every page, or one that silently reports nothing.
