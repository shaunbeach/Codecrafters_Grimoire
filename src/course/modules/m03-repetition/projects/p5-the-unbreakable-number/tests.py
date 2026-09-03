def test_small_primes():
    """The first few primes are recognised"""
    is_prime = require("is_prime")
    for n in (2, 3, 5, 7, 11, 13):
        assert is_prime(n) is True, f"is_prime({n}) gave {is_prime(n)!r}"


def test_composites():
    """Numbers with a divisor are refused"""
    is_prime = require("is_prime")
    for n in (4, 6, 8, 9, 15, 21, 100):
        assert is_prime(n) is False, f"is_prime({n}) gave {is_prime(n)!r}"


def test_two_is_prime():
    """Two is prime, and is the only even one"""
    is_prime = require("is_prime")
    assert is_prime(2) is True, (
        "is_prime(2) should be True. If your loop starts at 2 and tests n % 2, make "
        "sure it does not test n against itself."
    )


def test_one_and_below():
    """One is not prime, and nor is anything under it"""
    is_prime = require("is_prime")
    assert is_prime(1) is False, f"is_prime(1) gave {is_prime(1)!r}"
    assert is_prime(0) is False
    assert is_prime(-7) is False, (
        f"is_prime(-7) gave {is_prime(-7)!r}. Guard the small cases before the loop."
    )


def test_a_larger_prime():
    """It holds up on something bigger"""
    is_prime = require("is_prime")
    assert is_prime(7919) is True, "7919 is prime."
    assert is_prime(7917) is False, "7917 divides by 3."


def test_returns_a_real_boolean():
    """The answer is True or False"""
    is_prime = require("is_prime")
    assert isinstance(is_prime(7), bool), (
        f"Expected a bool, got {type(is_prime(7)).__name__}."
    )
