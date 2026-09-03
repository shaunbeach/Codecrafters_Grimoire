import os

from PIL import Image


def fit_all(folder, box):
    sizes = {}
    for name in sorted(os.listdir(folder)):
        full = os.path.join(folder, name)
        if not os.path.isfile(full):
            continue
        try:
            with Image.open(full) as image:
                image.thumbnail(box)
                image.save(full)
                sizes[name] = image.size
        except Exception:
            continue
    return sizes
