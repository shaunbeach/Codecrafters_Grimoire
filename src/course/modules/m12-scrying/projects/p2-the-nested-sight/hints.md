Outer loop over the articles, and three searches *inside* each one. That is the
whole structural idea of the working.
---
`soup.find_all("article", class_="story")` gives you the articles. Then, on each
`article`, `article.find("h2")` and `article.find("p", class_="summary")` and
`article.find("a")`.

Each of those can be `None`, so guard each before you take text or attributes
from it. A conditional expression keeps it to one line each.
---
```python
for article in soup.find_all("article", class_="story"):
    headline = article.find("h2")
    summary = article.find("p", class_="summary")
    link = article.find("a")
    stories.append({
        "headline": headline.get_text(strip=True) if headline else "",
        "summary": summary.get_text(strip=True) if summary else "",
        "link": link.get("href", "") if link else "",
    })
```
