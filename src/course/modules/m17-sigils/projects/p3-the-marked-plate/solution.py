from PIL import Image


def stamp(base_path, mark_path, out_path, corner):
    base = Image.open(base_path).convert("RGBA")
    mark = Image.open(mark_path).convert("RGBA")

    positions = {
        "top-left": (10, 10),
        "top-right": (base.width - mark.width - 10, 10),
        "bottom-left": (10, base.height - mark.height - 10),
        "bottom-right": (base.width - mark.width - 10, base.height - mark.height - 10),
    }
    if corner not in positions:
        raise ValueError(f"unknown corner: {corner}")

    plate = base.copy()
    plate.paste(mark, positions[corner], mark)
    plate.convert("RGB").save(out_path)
    return plate.size
