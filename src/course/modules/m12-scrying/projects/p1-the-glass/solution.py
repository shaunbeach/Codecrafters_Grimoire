from bs4 import BeautifulSoup


def scrape_headlines(html):
    soup = BeautifulSoup(html, "html.parser")
    return [heading.get_text(strip=True) for heading in soup.find_all("h2")]


def scrape_links(html):
    soup = BeautifulSoup(html, "html.parser")
    links = []
    for anchor in soup.find_all("a"):
        href = anchor.get("href")
        if href:
            links.append(href)
    return links
