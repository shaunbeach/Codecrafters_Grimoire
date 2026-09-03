## The situation

Every plate the guild issues carries the same sigil: a coloured field, a border,
and a mark in the middle. They are currently drawn by hand, badly, by whoever is
nearest.

Press **Run** on this one and look at the Files tab. You will see the image you
made.

## What good looks like

```python
paint_sigil("/workspace/plate.png", (200, 120), "navy")
# (200, 120)
```

A navy plate, 200 by 120, with a two-pixel gold border ten pixels in from every
edge, and a gold circle at its centre 40 pixels across.

## Your objective

**`paint_sigil(path, size, colour)`** — create the image, draw on it, save it as
PNG, and return its size as a `(width, height)` tuple.

- the background is `colour`
- a rectangle outlined in `gold`, width 2, inset 10 pixels from each edge
- a `gold` ellipse 40 pixels across, centred

## Watch out for

A box is `(left, top, right, bottom)`, not `(left, top, width, height)`. So a
rectangle inset ten pixels from a 200-wide plate runs from `10` to `190`, not
from `10` to `180`.

The centre of a 200×120 plate is `(100, 60)`, so a 40-wide circle spans `80` to
`120` horizontally and `40` to `80` vertically. Work those out rather than
guessing.
