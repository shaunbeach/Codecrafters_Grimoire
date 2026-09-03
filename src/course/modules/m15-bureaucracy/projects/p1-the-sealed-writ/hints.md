A reader, a writer, and a loop between them. `PdfReader(source).pages` is a list
you can index.
---
Guard each requested position against `len(reader.pages)` before you use it, and
count only the ones you actually added.

The write is `with open(destination, "wb") as handle: writer.write(handle)`.
---
```python
reader = PdfReader(source)
writer = PdfWriter()

written = 0
for number in pages:
    if 0 <= number < len(reader.pages):
        writer.add_page(reader.pages[number])
        written += 1

with open(destination, "wb") as handle:
    writer.write(handle)
return written
```
