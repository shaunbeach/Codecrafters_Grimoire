## The situation

Every plate needs the guild mark in a corner. The mark is a gold disc on a
transparent background, and the last person who tried this got a gold disc in a
grey square.

## What good looks like

```python
stamp("/workspace/plate.png", "/workspace/mark.png",
      "/workspace/stamped.png", "bottom-right")
# (200, 120)
```

The plate, unchanged, with the mark ten pixels in from the bottom-right corner —
and the navy showing through around the disc, not a grey box.

## Your objective

**`stamp(base_path, mark_path, out_path, corner)`** — paste the mark onto the
base ten pixels in from the named corner, save to `out_path`, and return the
result's size.

`corner` is one of `'top-left'`, `'top-right'`, `'bottom-left'`,
`'bottom-right'`. Anything else raises `ValueError` naming it.

The base image is not modified.

## Watch out for

`paste(mark, position)` ignores transparency and pastes the rectangle. You have
to pass the mark **a second time** as the mask: `paste(mark, position, mark)`.
That is the single most common Pillow question there is, and now you will never
have it.

The paste position is the mark's **top-left corner**, so a bottom-right
placement is `(base.width - mark.width - 10, base.height - mark.height - 10)`.
