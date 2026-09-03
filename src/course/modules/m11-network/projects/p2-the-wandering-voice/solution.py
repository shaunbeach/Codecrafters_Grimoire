import textwrap

import requests

JOKE_URL = "https://icanhazdadjoke.com/"
HEADERS = {"Accept": "application/json"}


def fetch_joke():
    try:
        response = requests.get(JOKE_URL, headers=HEADERS, timeout=5)
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
    lines = textwrap.wrap(joke, width=width)
    return "\n".join("  " + line for line in lines)
