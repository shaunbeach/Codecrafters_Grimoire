def test_a_named_arrival():
    """announce shouts the name and counts it"""
    announce = require("announce")
    result = announce("Kira")
    assert isinstance(result, str), f"Expected a string, got {type(result).__name__}."
    assert result == "Make way for KIRA, whose name is 4 letters long.", f"Got {result!r}"


def test_it_returns_rather_than_prints():
    """The cry is handed back, not shouted immediately"""
    announce = require("announce")
    result, printed = capture(announce, "Bo")
    assert result is not None, (
        "announce returned None. If you used print(), swap it for return."
    )
    assert not printed.strip(), "announce should return the cry, not print it."


def test_the_count_follows_the_name():
    """A longer name gets a bigger number"""
    announce = require("announce")
    assert announce("Bo") == "Make way for BO, whose name is 2 letters long."
    assert announce("Aurelia") == "Make way for AURELIA, whose name is 7 letters long.", (
        f"Got {announce('Aurelia')!r} — len() counts characters."
    )


def test_the_name_is_shouted():
    """Lowercase names are put into capitals"""
    announce = require("announce")
    assert "KIRA" in announce("kira"), (
        f"Got {announce('kira')!r}. The herald shouts — .upper() does that for you."
    )


def test_the_nameless_stranger():
    """An empty name gets its own line"""
    announce = require("announce")
    assert announce("") == "Make way for a stranger with no name.", f"Got {announce('')!r}"
