Work out the position first, from the corner name and the two sizes. Print it
before you paste anything — most of the difficulty is arithmetic, not Pillow.
---
A dict of corner name to position keeps this readable and gives you the
`ValueError` for free when the name is not in it.

Copy the base before pasting so the original is untouched: `base.copy()`.

And the mask: `plate.paste(mark, position, mark)`.
---
```python
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
plate.save(out_path)
```
