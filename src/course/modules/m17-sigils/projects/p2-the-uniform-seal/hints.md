Loop the folder, try to open each file as an image, and skip anything that will
not open. Everything else is two lines.
---
```python
try:
    with Image.open(full) as image:
        ...
except Exception:
    continue
```

Inside: `image.thumbnail(box)` — no assignment — then `image.save(full)` and
record `image.size`.

`thumbnail` already refuses to enlarge, so the already-small case needs no
special handling.
---
```python
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
```
