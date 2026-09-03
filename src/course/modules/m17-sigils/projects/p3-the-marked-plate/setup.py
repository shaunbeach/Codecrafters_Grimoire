# A plate to stamp, and a mark with transparency in it.
import os
from PIL import Image, ImageDraw

os.makedirs("/workspace", exist_ok=True)


def reset_plates():
    Image.new("RGB", (200, 120), "navy").save("/workspace/plate.png")

    mark = Image.new("RGBA", (40, 40), (0, 0, 0, 0))
    ImageDraw.Draw(mark).ellipse((0, 0, 39, 39), fill=(245, 196, 81, 255))
    mark.save("/workspace/mark.png")


reset_plates()
