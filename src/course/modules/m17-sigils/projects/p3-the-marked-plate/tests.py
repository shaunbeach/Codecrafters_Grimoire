from PIL import Image

BASE = "/workspace/plate.png"
MARK = "/workspace/mark.png"
OUT = "/workspace/stamped.png"


def test_returns_the_size():
    """The stamped plate is the size of the base"""
    stamp = require("stamp")
    reset_plates()
    assert stamp(BASE, MARK, OUT, "bottom-right") == (200, 120), (
        f"Got {stamp(BASE, MARK, OUT, 'bottom-right')!r}"
    )


def test_the_mark_lands_in_the_corner():
    """Bottom-right means bottom-right"""
    stamp = require("stamp")
    reset_plates()
    stamp(BASE, MARK, OUT, "bottom-right")
    with Image.open(OUT) as image:
        pixels = image.convert("RGB")
        assert pixels.getpixel((170, 90)) != (0, 0, 128), (
            "There is no mark near the bottom-right. The paste position is the mark's "
            "top-left corner, so subtract its size and the inset."
        )
        assert pixels.getpixel((20, 20)) == (0, 0, 128), "The top-left should be untouched."


def test_transparency_is_respected():
    """The navy shows through around the disc, not a grey box"""
    stamp = require("stamp")
    reset_plates()
    stamp(BASE, MARK, OUT, "top-left")
    with Image.open(OUT) as image:
        corner = image.convert("RGB").getpixel((11, 11))
    assert corner == (0, 0, 128), (
        f"The pixel just inside the mark's corner is {corner}, not navy. paste() "
        "ignores transparency unless you pass the mark a second time as the mask: "
        "paste(mark, position, mark)."
    )


def test_the_mark_is_actually_there():
    """The centre of the disc is gold"""
    stamp = require("stamp")
    reset_plates()
    stamp(BASE, MARK, OUT, "top-left")
    with Image.open(OUT) as image:
        centre = image.convert("RGB").getpixel((30, 30))
    assert centre[0] > 200 and centre[2] < 150, f"The disc centre is {centre}, not gold."


def test_all_four_corners():
    """Each corner puts it somewhere different"""
    stamp = require("stamp")
    reset_plates()
    seen = set()
    for corner in ("top-left", "top-right", "bottom-left", "bottom-right"):
        stamp(BASE, MARK, OUT, corner)
        with Image.open(OUT) as image:
            pixels = image.convert("RGB")
            spot = next(
                (x, y)
                for y in range(0, 120, 5)
                for x in range(0, 200, 5)
                if pixels.getpixel((x, y)) != (0, 0, 128)
            )
        seen.add(spot)
    assert len(seen) == 4, f"Only {len(seen)} distinct placements; the corners agree too much."


def test_unknown_corner_refused():
    """A corner that does not exist is an error"""
    stamp = require("stamp")
    reset_plates()
    try:
        stamp(BASE, MARK, OUT, "middle")
    except ValueError as exc:
        assert "middle" in str(exc), f"The message was {str(exc)!r}; name the corner."
        return
    raise AssertionError("An unknown corner should raise ValueError.")


def test_base_untouched():
    """The original plate is not modified"""
    stamp = require("stamp")
    reset_plates()
    stamp(BASE, MARK, OUT, "top-left")
    with Image.open(BASE) as image:
        assert image.convert("RGB").getpixel((30, 30)) == (0, 0, 128), (
            "The base image was stamped as well. Work on a copy."
        )
