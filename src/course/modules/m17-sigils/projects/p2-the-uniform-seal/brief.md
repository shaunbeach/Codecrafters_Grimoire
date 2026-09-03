## The situation

Four hundred plates, every one a different size, all needing to fit the same
space on a page — without any of them being squashed.

This is the working that gives somebody their afternoon back.

## What good looks like

```python
fit_all("/workspace/plates", (300, 300))
# {'wide.png': (300, 75), 'tall.png': (75, 300),
#  'square.png': (300, 300), 'already_small.png': (80, 60)}
```

Every image now fits inside a 300×300 box, none of them stretched, and the one
that was already smaller is untouched.

## Your objective

**`fit_all(folder, box)`** — resize every image in the folder so it fits inside
`box`, keeping its proportions, saving over the original. Return a dict of
`{filename: new_size}`.

- non-image files are skipped, not crashed on
- an image already smaller than the box is left exactly as it is
- proportions are never distorted

## Watch out for

`resize()` takes the size you give it and ignores the original ratio — a wide
image becomes a squashed square. `thumbnail()` is the one that fits *inside* a
box and keeps the shape.

But `thumbnail()` changes the image **in place and returns `None`**. Assigning
its result gives you `None`, which is the same trap as `list.sort()`.

`notes.txt` is in that folder. Opening it as an image raises, and one stray file
must not lose you the other three hundred and ninety-nine.
