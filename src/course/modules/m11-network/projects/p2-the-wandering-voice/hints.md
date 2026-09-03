Three separate ways this can fail, and each needs its own answer: the call
raising, a bad status, and a body without the key you want.
---
```python
try:
    response = requests.get(JOKE_URL, headers=HEADERS, timeout=5)
except requests.RequestException:
    return None
```

Then the status guard, then `data.get("joke") or None`.

For formatting: `textwrap.wrap(joke, width=width)` gives a list of lines; prefix
each with two spaces and join with newlines.
---
```python
def fetch_joke():
    try:
        response = requests.get(JOKE_URL, headers={"Accept": "application/json"}, timeout=5)
    except requests.RequestException:
        return None
    if response.status_code != 200:
        return None
    try:
        data = response.json()
    except ValueError:
        return None
    return data.get("joke") or None


def format_joke(joke, width=40):
    if not joke:
        return "  (no joke today)"
    return "\n".join("  " + line for line in textwrap.wrap(joke, width=width))
```
