Walk `document.paragraphs`, look at each `paragraph.style.name`, and keep the
ones that are headings. Print the style names first — seeing the real strings
makes the test obvious.
---
`name == "Title"` gives level 0.

`name.startswith("Heading ")` gives the rest, and the level is
`int(name.split()[-1])`.

Skip anything whose `.text.strip()` is empty, whichever style it has.
---
```python
headings = []
for paragraph in docx.Document(path).paragraphs:
    text = paragraph.text.strip()
    if not text:
        continue
    name = paragraph.style.name
    if name == "Title":
        headings.append((0, text))
    elif name.startswith("Heading "):
        headings.append((int(name.split()[-1]), text))
return headings
```
