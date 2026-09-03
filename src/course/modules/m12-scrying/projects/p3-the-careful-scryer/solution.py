from bs4 import BeautifulSoup


def scrape_prices(html):
    soup = BeautifulSoup(html, "html.parser")
    items = soup.find_all("li", class_="item")
    if not items:
        raise LookupError(
            "no elements matched li.item — the page layout may have changed"
        )

    prices = []
    for item in items:
        name = item.find("span", class_="name")
        price = item.find("span", class_="price")
        if not name or not price:
            continue
        try:
            amount = float(price.get_text(strip=True).replace("£", ""))
        except ValueError:
            continue
        prices.append({"name": name.get_text(strip=True), "price": amount})
    return prices
