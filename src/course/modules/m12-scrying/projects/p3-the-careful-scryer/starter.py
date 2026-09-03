from bs4 import BeautifulSoup


def scrape_prices(html):
    # your code here
    pass


if __name__ == "__main__":
    print(scrape_prices(SHOP_HTML))
    try:
        scrape_prices(EMPTY_SHOP_HTML)
    except LookupError as exc:
        print("refused:", exc)
