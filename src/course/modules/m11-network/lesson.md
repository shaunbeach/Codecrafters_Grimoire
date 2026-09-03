# The Aether

Here is where the apprentice stops being an apprentice, so sit with this for a
moment before you write anything.

You are about to send a question to a machine you have never seen, in a building
you could not find, owned by people you will never meet — and it is going to
answer you, correctly, in less than a second. You will do it in one line. You
will do it so casually that within a week you will have stopped noticing.

Everything in Act One was a metaphor. This is not. **This is the magic**, and
almost nobody who uses it every day has ever stopped to be amazed by it.

## Reaching out

Everything else in Python ships with Python. This does not:

```
pip install requests
```

In real work you would do that inside a **virtual environment** — a private copy
of Python for one project, so two projects can want different versions of the
same library without fighting:

```
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install requests
```

> In this grimoire `requests` is already here, wired to a small stand-in
> service, because a browser tab cannot open a raw socket. Everything you write
> is real `requests` code.

## Asking

```python
import requests

response = requests.get("https://api.example.com/weather", params={"city": "London"})
```

`params` builds the query string for you — `?city=London` — and escapes anything
awkward. Hand-built URLs go wrong the first time a city has a space in it.

## What comes back

```python
response.status_code     # 200
response.ok              # True for anything under 400
response.text            # the raw body, as a string
response.json()          # the body, parsed into Python objects
```

| Code | Means |
| --- | --- |
| 200 | fine |
| 400 | your request was malformed |
| 401 / 403 | not authenticated / not allowed |
| 404 | no such thing |
| 429 | you are asking too fast |
| 500 | their fault, not yours |

**Always check the status before you parse.** A 404 body is an error message,
not the data you wanted, and calling `.json()` on it either raises or — far
worse — hands you a dictionary with entirely different keys, which then flows
into the rest of your programme looking perfectly healthy.

```python
if response.status_code != 200:
    return None
```

## JSON is dicts and lists

JSON maps onto Python almost exactly. Objects become dicts, arrays become lists,
`true`/`false`/`null` become `True`/`False`/`None`.

```json
{
  "location": {"name": "London", "country": "United Kingdom"},
  "current": {"temp_c": 12.5, "condition": {"text": "Light rain"}}
}
```

```python
data = response.json()
data["current"]["condition"]["text"]      # 'Light rain'
```

Every one of those brackets can raise `KeyError` if the service changes shape.
`.get()` with a default is the defensive version, and services do change shape —
usually on a Friday.

## Headers

A request carries more than a URL. The one you will set most often says what
format you want back:

```python
response = requests.get(URL, headers={"Accept": "application/json"})
```

Some services return a web page, plain text or JSON from the *same URL*
depending on that header. Without it you get something your parser was not
expecting.

| Header | Says |
| --- | --- |
| `Accept` | the format you want |
| `User-Agent` | who you are — some services refuse the default |
| `Authorization` | your key or token |

**Never put a key in your source.** Read it from the environment:

```python
import os
headers = {"Authorization": f"Bearer {os.environ['MY_API_KEY']}"}
```

Code gets committed. Secrets in git are secrets in public, and the internet has
robots that do nothing but look for them.

## Everything about this can fail

The service can be down. The wifi can drop. The answer can be nonsense. All of
it will happen, and a script that assumes otherwise is a script that wakes
somebody at three in the morning.

```python
try:
    response = requests.get(URL, headers=HEADERS, timeout=5)
except requests.RequestException:
    return None

if response.status_code != 200:
    return None
```

`requests.RequestException` is the base class of everything the library raises,
so one `except` covers timeouts, DNS failures and connection resets.

**`timeout=5` matters more than it looks.** Without it, a hung service hangs
*your* programme — indefinitely, with no error, no message, and nothing in the
log to explain why the nightly job never finished.

## Be a good guest

You are making requests to somebody else's machine, at their expense.

- put a delay between calls; a loop with no `time.sleep()` is indistinguishable
  from an attack
- cache what you fetch, so debugging your parser does not mean hammering their
  service a hundred times
- read their terms, and identify yourself honestly in your `User-Agent`

The magic is real. So is the electricity bill at the other end.
