Make the soup once at the top of each working, then ask it for what you need.
Printing `soup.find_all("h2")` before you extract anything shows you exactly
what you are holding.
---
`soup.find_all("h2")` gives a list of tags — not strings. The text comes from
`.get_text(strip=True)` on each one.

For the links, loop rather than comprehend, because you need to skip the ones
with no `href`.
---
```python
def scrape_headlines(html):
    soup = BeautifulSoup(html, "html.parser")
    return [h.get_text(strip=True) for h in soup.find_all("h2")]


def scrape_links(html):
    soup = BeautifulSoup(html, "html.parser")
    links = []
    for anchor in soup.find_all("a"):
        href = anchor.get("href")
        if href:
            links.append(href)
    return links
```
