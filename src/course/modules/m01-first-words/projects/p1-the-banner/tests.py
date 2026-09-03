BANNER = [
    "+----------------------+",
    "|  WELCOME, ADVENTURER |",
    "+----------------------+",
    "Your journey begins.",
]


def test_something_is_printed():
    """Your file prints something when it runs"""
    assert script_output().strip(), (
        "Nothing was printed. These four statements go at the top level of the "
        "file, not inside a function."
    )


def test_banner_matches():
    """All four lines are exactly right"""
    printed = [line.rstrip() for line in script_output().split("\n") if line.strip()]
    assert printed == BANNER, (
        "The banner does not match. Expected:\n"
        + "\n".join(BANNER)
        + "\n\nbut your file printed:\n"
        + "\n".join(printed)
    )


def test_no_extra_lines():
    """Exactly four lines, with nothing else printed"""
    printed = [line for line in script_output().split("\n") if line.strip()]
    assert len(printed) == 4, (
        f"Expected 4 lines but found {len(printed)}. Nothing else should be printed."
    )
