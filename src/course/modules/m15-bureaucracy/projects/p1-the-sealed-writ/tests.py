from pypdf import PdfReader

SOURCE = "/workspace/writ.pdf"
DEST = "/workspace/extract.pdf"


def test_returns_the_count():
    """It reports how many pages it took"""
    extract_pages = require("extract_pages")
    reset_chancery()
    assert extract_pages(SOURCE, DEST, [0, 2, 4]) == 3, (
        f"Got {extract_pages(SOURCE, DEST, [0, 2, 4])!r}"
    )


def test_writes_a_real_pdf():
    """The extract can be opened again"""
    extract_pages = require("extract_pages")
    reset_chancery()
    extract_pages(SOURCE, DEST, [0, 2, 4])
    assert len(PdfReader(DEST).pages) == 3, (
        f"The extract has {len(PdfReader(DEST).pages)} pages. If this raised instead, "
        'check you opened the destination with "wb" — a PDF is bytes.'
    )


def test_the_right_pages():
    """The pages are the ones that were asked for"""
    extract_pages = require("extract_pages")
    reset_chancery()
    extract_pages(SOURCE, DEST, [0, 2, 4])
    widths = [round(float(p.mediabox.width)) for p in PdfReader(DEST).pages]
    assert widths == [200, 220, 240], (
        f"Got pages of width {widths}. The source pages are 200, 210, 220, 230, 240 "
        "wide, so positions 0, 2 and 4 are 200, 220 and 240."
    )


def test_order_is_preserved():
    """They come out in the order they were requested"""
    extract_pages = require("extract_pages")
    reset_chancery()
    extract_pages(SOURCE, DEST, [4, 0])
    widths = [round(float(p.mediabox.width)) for p in PdfReader(DEST).pages]
    assert widths == [240, 200], f"Got {widths}"


def test_out_of_range_is_skipped():
    """Asking for page nine of five is survivable"""
    extract_pages = require("extract_pages")
    reset_chancery()
    try:
        result = extract_pages(SOURCE, DEST, [0, 99, 2])
    except IndexError:
        raise AssertionError(
            "extract_pages raised IndexError. Check each position against the page "
            "count before using it."
        )
    assert result == 2, f"Got {result} — two of the three positions exist."


def test_source_untouched():
    """The original writ is left as it was"""
    extract_pages = require("extract_pages")
    reset_chancery()
    extract_pages(SOURCE, DEST, [0])
    assert len(PdfReader(SOURCE).pages) == 5, "The source should still have five pages."
