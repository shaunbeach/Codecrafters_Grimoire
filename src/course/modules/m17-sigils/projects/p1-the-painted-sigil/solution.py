from PIL import Image, ImageDraw


def paint_sigil(path, size, colour):
    width, height = size
    image = Image.new("RGB", size, colour)
    draw = ImageDraw.Draw(image)

    draw.rectangle((10, 10, width - 10, height - 10), outline="gold", width=2)

    cx, cy = width // 2, height // 2
    draw.ellipse((cx - 20, cy - 20, cx + 20, cy + 20), fill="gold")

    image.save(path)
    return image.size
