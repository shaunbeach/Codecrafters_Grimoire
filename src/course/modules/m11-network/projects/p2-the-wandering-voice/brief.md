## The situation

The joke service is fussy in a way that will teach you something: the **same
URL** returns a web page, plain text, or JSON depending on what you say you
want. Ask wrongly and it answers 406.

It is also, like every service, occasionally down — and your working has to
survive that without a traceback.

## What good looks like

```python
fetch_joke()
# "I don't trust stairs. They're always up to something."

format_joke("I don't trust stairs. They're always up to something.", width=30)
# "  I don't trust stairs. They're\n  always up to something."

format_joke(None)
# '  (no joke today)'
```

## Your objective

**`fetch_joke()`** — call `https://icanhazdadjoke.com/` and return the joke text.
Return `None` if the status is not 200, if the body has no `joke` key, **or if
`requests` raises at all**.

**`format_joke(joke, width=40)`** — wrap the joke to `width` characters, indent
each line by two spaces, and never break a word. `None` or an empty string gives
`'  (no joke today)'`.

## Watch out for

The service requires `Accept: application/json`. Without that header you get a
406 and no joke — which is exactly the class of bug that has you staring at
perfectly correct parsing code.

Catch `requests.RequestException`. It is the base class of everything the
library raises, so one `except` covers timeouts, connection resets and DNS
failures together.

`textwrap.wrap(text, width)` breaks only between words.
