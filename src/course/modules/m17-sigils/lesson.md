# The Atelier

An image is a grid of numbers. That is the entire secret, and once you have seen
it you cannot unsee it.

```
pip install Pillow
```

Everything in this module is the same insight applied four hundred times in a
row, faster than a person could open the first file.

## Opening and looking

```python
from PIL import Image

image = Image.open("holiday.jpg")

image.size        # (1920, 1080)   — a (width, height) tuple
image.width       # 1920
image.height      # 1080
image.format      # 'JPEG'
image.mode        # 'RGB'
```

`mode` matters more than it looks. `'RGB'` is three numbers per pixel; `'RGBA'`
adds transparency; `'L'` is greyscale. Saving an `'RGBA'` image as JPEG raises,
because JPEG has no concept of transparency — convert first:

```python
image.convert("RGB").save("out.jpg")
```

## Coordinates

The origin is the **top left**, and `y` increases downward. That is the opposite
of every graph you were ever shown at school, and it catches everyone once.

A **box** is `(left, top, right, bottom)` — the right and bottom edges are
excluded, exactly like a slice:

```python
image.crop((0, 0, 100, 100))     # the top-left hundred square pixels
```

## Making a new one

```python
new = Image.new("RGB", (200, 100), "navy")
new.save("plate.png")
```

Size first, colour second. Colours can be names, `"#1a1f2a"`, or `(26, 31, 42)`.

## Changing shape

```python
image.resize((400, 300))                    # exact, ignores the original ratio
image.thumbnail((400, 300))                 # fits inside, KEEPS the ratio, in place
image.rotate(90, expand=True)               # expand or the corners are cut off
image.transpose(Image.FLIP_LEFT_RIGHT)
```

Two things worth knowing. `thumbnail` changes the image **in place** and returns
`None` — assigning its result gives you `None`, which is the same trap as
`list.sort()`. And it never enlarges: an image smaller than the box is left
alone, which is usually what you want and occasionally a surprise.

To keep the ratio yourself, compute it:

```python
ratio = min(box_width / image.width, box_height / image.height)
new_size = (round(image.width * ratio), round(image.height * ratio))
```

## Putting one image on another

```python
base = Image.open("photo.png")
mark = Image.open("sigil.png")

base.paste(mark, (10, 10))              # top-left corner goes here
base.paste(mark, (10, 10), mark)        # third argument = use its transparency
```

That third argument is the mask. Without it, a transparent logo pastes as a
rectangle with a grey box around it — the single most common Pillow question
there is.

## Drawing

```python
from PIL import ImageDraw

draw = ImageDraw.Draw(image)
draw.rectangle((10, 10, 90, 50), fill="gold", outline="black", width=2)
draw.ellipse((10, 10, 50, 50), fill="navy")
draw.line((0, 0, 100, 100), fill="white", width=3)
draw.text((12, 14), "SEALED", fill="black")
```

You draw **onto** the image; there is nothing to save from the `Draw` object
itself.

## The point

None of this is impressive one image at a time — you have a photo editor for
that.

It becomes magic at four hundred. A folder of holiday photographs, every one
resized to fit a page, stamped with the same mark in the same corner, saved
under a tidy name, in the time it takes to fill a kettle. That is a real
afternoon of somebody's life, given back, and it is about fifteen lines.
