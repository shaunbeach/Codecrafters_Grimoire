# The Glass

Scrying, in the old stories, is looking into a surface and seeing something that
was never meant for you — a room you are not in, a conversation you were not
part of.

That is exactly what this is.

A web page is written for a person: for their eyes, their browser, their
scrolling. Nobody prepared it for you. There is no agreed format, no contract,
no promise that it will look the same tomorrow. You are looking into the glass
and taking what you find.

It is the least reliable magic in this grimoire, and the most useful. Most of
the world's data has no API.

## What you are actually looking at

```html
<article class="story">
  <h2 class="headline">Python turns 35</h2>
  <p class="summary">Still growing.</p>
  <a class="more" href="/news/python-35">Read more</a>
</article>
```

Every **tag** can hold text and other tags. `class` and `href` are
**attributes**. That nesting is the thing you navigate.

## Do not parse HTML with string methods

Your instinct will be `text.split("<h2>")`. Resist it, permanently.

Real HTML has attributes in unpredictable orders, tags that never close, comments
in the middle, whitespace everywhere, and the same element written four
different ways on four different pages. A parser handles all of it. `split`
handles none of it, and the failures are silent — you get half your data and no
error at all.

## The lens

```
pip install beautifulsoup4
```

```python
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, "html.parser")
```

The second argument names the parser. `"html.parser"` is built into Python;
`"lxml"` is faster if you install it.

> This grimoire provides an offline BeautifulSoup with the same API, so
> everything here is code you could paste into real work.

## Finding

```python
soup.find("h1")                        # the first h1, or None
soup.find_all("a")                     # every a, as a list
soup.find_all("a", class_="more")      # every a with class="more"
soup.find_all(["h1", "h2"])            # either tag
soup.find_all("a", limit=3)            # stop after three
```

It is `class_` with a trailing underscore, because `class` is a reserved word.

**`find` returns `None` when nothing matches.** So `soup.find("h2").text` is a
crash waiting for the week the page changes:

```python
heading = soup.find("h2")
title = heading.get_text(strip=True) if heading else ""
```

## Taking the text out

```python
tag.get_text()                 # all text inside, including nested tags
tag.get_text(strip=True)       # with the surrounding whitespace gone
tag.text                       # shorthand for get_text()
```

HTML is full of newlines and indentation that all become part of the text.
**Strip almost always.**

## Taking the attributes out

```python
link["href"]              # KeyError if the attribute is missing
link.get("href")          # None instead
link.get("href", "")      # your own default
link.attrs                # every attribute, as a dict
```

Use `.get()` unless a missing attribute genuinely deserves to stop the
programme. On a page you do not control, it rarely does.

## Search inside what you found

This is the part that separates a working scraper from three lists that do not
line up:

```python
for story in soup.find_all("article", class_="story"):
    headline = story.find("h2").get_text(strip=True)
    link = story.find("a")["href"]
```

Anything `find_all` gives you is itself searchable. Collecting all the headlines
and all the links separately and zipping them together *works* — right up until
one story has no link, and every pairing after it is silently wrong.

Search **within** each item and the pairing cannot drift.

## Scrying is not free

You are reading a machine that belongs to somebody else, and they are paying for
it.

- read the site's terms and its `robots.txt`
- identify yourself honestly in a `User-Agent`
- put `time.sleep()` between requests — a tight loop is indistinguishable from
  an attack, and will be treated as one
- **cache what you fetch**, so that debugging your parser does not mean hitting
  their server a hundred more times

And the practical warning: a scraper is built on somebody else's layout, so it
will break. Not if — when. Write it so that when it does, it fails loudly and
tells you which selector stopped matching, rather than quietly returning an
empty list that flows into your database as "no results today".
