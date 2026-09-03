Three steps: make the image, get a `Draw` for it, draw two shapes. Save last.
---
`Image.new("RGB", size, colour)` then `ImageDraw.Draw(image)`.

For the border, the box is `(10, 10, width - 10, height - 10)`.

For the circle, compute the centre first, then subtract and add 20 in each
direction.
---
```python
width, height = size
image = Image.new("RGB", size, colour)
draw = ImageDraw.Draw(image)

draw.rectangle((10, 10, width - 10, height - 10), outline="gold", width=2)

cx, cy = width // 2, height // 2
draw.ellipse((cx - 20, cy - 20, cx + 20, cy + 20), fill="gold")

image.save(path)
return image.size
```
