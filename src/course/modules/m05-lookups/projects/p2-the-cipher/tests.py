LETTERS = "abcdefghijklmnopqrstuvwxyz"


def test_cipher_covers_the_alphabet():
    """build_cipher returns a 26-entry mapping"""
    build_cipher = require("build_cipher")
    cipher = build_cipher(3)
    assert isinstance(cipher, dict), f"Expected a dict, got {type(cipher).__name__}."
    assert set(cipher) == set(LETTERS), (
        f"The cipher should have all 26 lowercase letters as keys. "
        f"Missing: {sorted(set(LETTERS) - set(cipher))}"
    )
    assert set(cipher.values()) == set(LETTERS), (
        "Every letter should also appear exactly once as a value."
    )


def test_cipher_wraps():
    """Shifting past z wraps back to a"""
    build_cipher = require("build_cipher")
    cipher = build_cipher(3)
    assert cipher["a"] == "d", f"cipher['a'] should be 'd', got {cipher['a']!r}"
    assert cipher["z"] == "c", (
        f"cipher['z'] should wrap around to 'c', got {cipher['z']!r}. Try % 26."
    )


def test_encode_basic():
    """encode shifts the letters"""
    encode = require("encode")
    assert encode("attack at dawn", 3) == "dwwdfn dw gdzq", f"Got {encode('attack at dawn', 3)!r}"


def test_non_letters_pass_through():
    """Spaces, punctuation, digits and capitals are left alone"""
    encode = require("encode")
    result = encode("Hi there, 42 friends!", 5)
    assert result == "Hn ymjwj, 42 kwnjsix!", (
        f"Got {result!r}. Only lowercase a-z should shift — use .get(ch, ch)."
    )


def test_full_shift_is_identity():
    """A shift of 0 or 26 changes nothing"""
    encode = require("encode")
    for shift in [0, 26, 52]:
        assert encode("hello world", shift) == "hello world", (
            f"A shift of {shift} should leave the text unchanged, got {encode('hello world', shift)!r}"
        )


def test_decode_undoes_encode():
    """Anything encoded can be decoded"""
    encode = require("encode")
    decode = require("decode")
    for shift in [1, 3, 13, 25]:
        secret = encode(LETTERS + " and a message!", shift)
        assert decode(secret, shift) == LETTERS + " and a message!", (
            f"Round trip failed at shift {shift}: encoded to {secret!r}, "
            f"decoded back to {decode(secret, shift)!r}"
        )


def test_decode_directly():
    """decode works on a message it did not encode"""
    decode = require("decode")
    assert decode("dwwdfn dw gdzq!", 3) == "attack at dawn!", (
        f"Got {decode('dwwdfn dw gdzq!', 3)!r}"
    )
