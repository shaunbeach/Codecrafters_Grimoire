REPORT = "/workspace/report.docx"


def test_finds_the_headings():
    """Every heading, in document order, with its level"""
    outline = require("outline")
    reset_chancery()
    result = outline(REPORT)
    assert result == [
        (0, "Quarterly Review"),
        (1, "Findings"),
        (1, "Recommendations"),
    ], f"Got {result}"


def test_title_is_level_zero():
    """The Title style is level 0, not level 1"""
    outline = require("outline")
    reset_chancery()
    assert outline(REPORT)[0] == (0, "Quarterly Review"), f"Got {outline(REPORT)[0]}"


def test_body_text_excluded():
    """Ordinary paragraphs are not headings"""
    outline = require("outline")
    reset_chancery()
    texts = [text for _level, text in outline(REPORT)]
    assert "Sales rose in the North." not in texts, f"Got {texts}"
    assert "Buy more rope." not in texts, f"Got {texts}"


def test_list_items_excluded():
    """A bullet is a style, not a heading"""
    outline = require("outline")
    reset_chancery()
    texts = [text for _level, text in outline(REPORT)]
    assert "Ropes" not in texts, (
        f"Got {texts}. 'List Bullet' is not 'Normal', so a test for 'anything that is "
        "not Normal' picks it up — match the heading styles exactly instead."
    )


def test_empty_paragraphs_skipped():
    """Word's blank paragraphs do not appear"""
    outline = require("outline")
    reset_chancery()
    assert all(text.strip() for _level, text in outline(REPORT)), (
        f"Got {outline(REPORT)} — an empty paragraph got through."
    )


def test_levels_are_ints():
    """The level is a number, not the style name"""
    outline = require("outline")
    reset_chancery()
    assert all(isinstance(level, int) for level, _text in outline(REPORT)), (
        f"Got {outline(REPORT)}. The level is the number at the end of 'Heading 1'."
    )
