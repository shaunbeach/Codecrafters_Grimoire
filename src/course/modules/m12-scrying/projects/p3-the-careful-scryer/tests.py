def test_reads_the_shop():
    """Every well-formed item comes back"""
    scrape_prices = require("scrape_prices")
    result = scrape_prices(SHOP_HTML)
    assert result == [
        {"name": "Rope", "price": 4.5},
        {"name": "Lantern", "price": 12.0},
        {"name": "Coin pouch", "price": 2.25},
    ], f"Got {result}"


def test_prices_are_numbers():
    """The currency symbol does not survive"""
    scrape_prices = require("scrape_prices")
    price = scrape_prices(SHOP_HTML)[0]["price"]
    assert isinstance(price, float), (
        f"The price came back as {type(price).__name__}: {price!r}. Strip the £ and "
        "convert."
    )


def test_a_bad_row_is_skipped():
    """One odd item does not lose you the page"""
    scrape_prices = require("scrape_prices")
    result = scrape_prices(BROKEN_SHOP_HTML)
    assert result == [{"name": "Rope", "price": 4.5}], (
        f"Got {result}. One item has no price and another has 'ask within' — both "
        "are skipped, and Rope still comes back."
    )


def test_nothing_matching_raises():
    """A changed layout is worth stopping for"""
    scrape_prices = require("scrape_prices")
    try:
        scrape_prices(EMPTY_SHOP_HTML)
    except LookupError as exc:
        assert "li.item" in str(exc), (
            f"The message was {str(exc)!r}. Naming the selector that stopped matching "
            "is what turns a broken scraper into a ten-minute fix."
        )
        return
    raise AssertionError(
        "A page where nothing matched returned quietly. An empty result reads as "
        "'nothing for sale today' and gets believed — raise instead."
    )
