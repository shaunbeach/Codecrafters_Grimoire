Make the document, add the title, loop the sections, save, return the count.
Nothing here needs a guard.
---
`document.add_heading(title, level=0)` for the title;
`document.add_heading(name, level=1)` for each section.

For the lines, `document.add_paragraph(line, style="List Bullet")`.

Each `sections` entry is a `(name, lines)` pair, so unpack it in the `for`.
---
```python
document = docx.Document()
document.add_heading(title, level=0)

for name, lines in sections:
    document.add_heading(name, level=1)
    for line in lines:
        document.add_paragraph(line, style="List Bullet")

document.save(path)
return len(sections)
```
