from bs4 import BeautifulSoup


def scrape_stories(html):
    soup = BeautifulSoup(html, "html.parser")
    stories = []
    for article in soup.find_all("article", class_="story"):
        headline = article.find("h2")
        summary = article.find("p", class_="summary")
        link = article.find("a")
        stories.append(
            {
                "headline": headline.get_text(strip=True) if headline else "",
                "summary": summary.get_text(strip=True) if summary else "",
                "link": link.get("href", "") if link else "",
            }
        )
    return stories
