# A folder of images at wildly different sizes, as a real one would be.
import os, shutil
from PIL import Image

FOLDER = "/workspace/plates"
SIZES = {
    "wide.png": (800, 200),
    "tall.png": (200, 800),
    "square.png": (600, 600),
    "already_small.png": (80, 60),
}


def reset_plates():
    if os.path.exists(FOLDER):
        shutil.rmtree(FOLDER)
    os.makedirs(FOLDER)
    for name, size in SIZES.items():
        Image.new("RGB", size, "navy").save(os.path.join(FOLDER, name))
    with open(os.path.join(FOLDER, "notes.txt"), "w") as handle:
        handle.write("not an image\n")


reset_plates()
