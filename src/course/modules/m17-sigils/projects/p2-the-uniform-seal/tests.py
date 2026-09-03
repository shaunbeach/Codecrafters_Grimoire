import os

from PIL import Image

FOLDER = "/workspace/plates"


def test_everything_fits():
    """No image is larger than the box in either direction"""
    fit_all = require("fit_all")
    reset_plates()
    sizes = fit_all(FOLDER, (300, 300))
    for name, size in sizes.items():
        assert size[0] <= 300 and size[1] <= 300, f"{name} came out {size}"


def test_proportions_are_kept():
    """A wide image stays wide"""
    fit_all = require("fit_all")
    reset_plates()
    sizes = fit_all(FOLDER, (300, 300))
    assert sizes["wide.png"] == (300, 75), (
        f"wide.png came out {sizes['wide.png']}. It was 800x200; fitting it into 300 "
        "wide makes it 75 tall. resize() would have squashed it to 300x300."
    )
    assert sizes["tall.png"] == (75, 300), f"tall.png came out {sizes['tall.png']}"


def test_small_images_left_alone():
    """Something already smaller is not enlarged"""
    fit_all = require("fit_all")
    reset_plates()
    sizes = fit_all(FOLDER, (300, 300))
    assert sizes["already_small.png"] == (80, 60), (
        f"Got {sizes['already_small.png']} — thumbnail never enlarges."
    )


def test_saved_to_disk():
    """The change survives"""
    fit_all = require("fit_all")
    reset_plates()
    fit_all(FOLDER, (300, 300))
    with Image.open(os.path.join(FOLDER, "wide.png")) as image:
        assert image.size == (300, 75), (
            f"On disk it is still {image.size}. thumbnail changes the image in memory; "
            "save() is what writes it."
        )


def test_non_images_skipped():
    """One stray text file does not lose you the folder"""
    fit_all = require("fit_all")
    reset_plates()
    try:
        sizes = fit_all(FOLDER, (300, 300))
    except Exception as exc:
        raise AssertionError(
            f"fit_all raised {type(exc).__name__} on notes.txt. Skip what will not open."
        )
    assert "notes.txt" not in sizes, f"Got {sorted(sizes)}"
    assert len(sizes) == 4, f"Expected the four images, got {sorted(sizes)}"


def test_returns_new_sizes():
    """The report is of what they became"""
    fit_all = require("fit_all")
    reset_plates()
    sizes = fit_all(FOLDER, (100, 100))
    assert sizes["square.png"] == (100, 100), f"Got {sizes['square.png']}"
