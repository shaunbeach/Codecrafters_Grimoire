import os

from PIL import Image

PLATE = "/workspace/plate.png"


def test_returns_the_size():
    """It reports the plate it made"""
    paint_sigil = require("paint_sigil")
    assert paint_sigil(PLATE, (200, 120), "navy") == (200, 120), (
        f"Got {paint_sigil(PLATE, (200, 120), 'navy')!r}"
    )


def test_writes_a_real_image():
    """The file is a PNG that opens again"""
    paint_sigil = require("paint_sigil")
    paint_sigil(PLATE, (200, 120), "navy")
    assert os.path.exists(PLATE), "No image was written."
    with Image.open(PLATE) as image:
        assert image.size == (200, 120), f"The image is {image.size}."


def test_the_background():
    """A corner outside the border is the colour asked for"""
    paint_sigil = require("paint_sigil")
    paint_sigil(PLATE, (200, 120), "navy")
    with Image.open(PLATE) as image:
        assert image.convert("RGB").getpixel((2, 2)) == (0, 0, 128), (
            f"The corner is {image.convert('RGB').getpixel((2, 2))}, not navy."
        )


def test_the_border_is_inset():
    """The rectangle sits ten pixels in on every side"""
    paint_sigil = require("paint_sigil")
    paint_sigil(PLATE, (200, 120), "navy")
    with Image.open(PLATE) as image:
        pixels = image.convert("RGB")
        assert pixels.getpixel((10, 60)) != (0, 0, 128), (
            "There is no border at x=10. The box is (left, top, right, bottom), so an "
            "inset of ten runs from 10 to width - 10."
        )
        assert pixels.getpixel((189, 60)) != (0, 0, 128), (
            "There is no border at the right edge. width - 10 is 190, and the box's "
            "right edge is drawn just inside it."
        )


def test_the_centre_mark():
    """A gold circle sits in the middle"""
    paint_sigil = require("paint_sigil")
    paint_sigil(PLATE, (200, 120), "navy")
    with Image.open(PLATE) as image:
        pixels = image.convert("RGB")
        assert pixels.getpixel((100, 60)) != (0, 0, 128), "The centre is still background."
        assert pixels.getpixel((100, 20)) == (0, 0, 128), (
            "The mark is too tall — it should be 40 pixels across, not the full height."
        )


def test_other_sizes():
    """The working is not hard-coded to one plate"""
    paint_sigil = require("paint_sigil")
    assert paint_sigil("/workspace/small.png", (120, 120), "black") == (120, 120)
    with Image.open("/workspace/small.png") as image:
        assert image.convert("RGB").getpixel((60, 60)) != (0, 0, 0), (
            "The centre mark is not centred on a different size — compute the centre "
            "from the size rather than hard-coding it."
        )
