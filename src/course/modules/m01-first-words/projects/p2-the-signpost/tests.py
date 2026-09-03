def test_sign_shape():
    """build_sign('Kira') returns the name and a matching rule"""
    build_sign = require("build_sign")
    result = build_sign("Kira")
    assert isinstance(result, str), (
        "build_sign should return a string, but it returned "
        f"{type(result).__name__}. Did you print instead of return?"
    )
    assert result == "~ Kira ~\n========", f"Expected '~ Kira ~\\n========' but got {result!r}"


def test_sign_adapts():
    """The rule is always as long as the line above it"""
    build_sign = require("build_sign")
    for name in ["Bo", "Aurelia Nightwhisper", "X"]:
        top, _, rule = build_sign(name).partition("\n")
        assert top == f"~ {name} ~", f"For {name!r} the first line was {top!r}"
        assert rule == "=" * len(top), (
            f"For {name!r} the rule was {len(rule)} characters "
            f"but the line above it is {len(top)}."
        )


def test_no_trailing_newline():
    """The returned sign is exactly two lines"""
    build_sign = require("build_sign")
    result = build_sign("Kira")
    assert result.count("\n") == 1, (
        f"Expected exactly one newline joining the two lines, found {result.count(chr(10))}."
    )
