# The Chancery

Every institution in the world runs on documents that were designed to be
*printed*, not read.

A PDF is a description of where to put ink on a page. There are no paragraphs in
it, no headings, no meaning — only glyphs at coordinates. When you extract text
from one, you are reverse-engineering a picture back into words, and the result
is sometimes exactly right and sometimes a jumble.

A `.docx` is different in an interesting way: it is a zip archive full of XML
that genuinely does know what a heading is. It just does not want you reading it
directly.

Both are sealed against casual reading. Both open with one `pip install`.

## Reading a writ

```
pip install pypdf
```

```python
from pypdf import PdfReader

reader = PdfReader("contract.pdf")
len(reader.pages)                      # 12
reader.pages[0].extract_text()         # 'CONTRACT OF CARRIAGE\n\nBetween...'
```

Three things that will surprise you the first time:

- **Extraction is approximate.** Columns interleave. Tables come out as soup.
  Some PDFs are scanned images with no text in them at all, and you get `''`
  — which is not a bug in your code.
- **`extract_text()` can return `None`** on a page with nothing extractable, so
  `page.extract_text() or ""` is the safe form.
- Page numbers start at **0** here, while every human referring to the document
  counts from 1. Decide which you are using and say so in your variable names.

## Writing one

```python
from pypdf import PdfWriter

writer = PdfWriter()
for page in reader.pages[:3]:
    writer.add_page(page)

with open("extract.pdf", "wb") as handle:
    writer.write(handle)
```

Note `"wb"` — bytes, not text. Opening a PDF with `"w"` gives you a
`TypeError`, and it is the most common mistake in this module.

You can also merge, rotate and encrypt:

```python
writer.append("appendix.pdf")
page.rotate(90)
writer.encrypt("password")
```

## Reading a bound volume

```
pip install python-docx
```

```python
import docx

document = docx.Document("report.docx")
for paragraph in document.paragraphs:
    print(paragraph.style.name, "|", paragraph.text)
```

```
Title | Quarterly Review
Heading 1 | Findings
Normal | Sales rose in the North.
```

**This is the part a PDF cannot give you.** The style name tells you what the
paragraph *is* — a title, a heading, body text — not merely how it looked. You
can pull every heading out of a hundred-page report in four lines, and that is
genuinely not possible with a PDF without guessing at font sizes.

Empty paragraphs are real and common; Word puts them in whenever somebody
presses Enter twice. Skip them:

```python
headings = [
    p.text for p in document.paragraphs
    if p.style.name.startswith("Heading") and p.text.strip()
]
```

## Drafting one

```python
document = docx.Document()
document.add_heading("Quarterly Review", level=0)     # level 0 is the Title
document.add_heading("Findings", level=1)
document.add_paragraph("Sales rose in the North.")
document.add_paragraph("Ropes", style="List Bullet")
document.save("review.docx")
```

`add_heading(..., level=0)` produces a Title; levels 1 to 9 are Heading 1
through Heading 9. Those names matter — they are what makes the document
navigable, and what lets the next programme along read its structure back.

## Why this is worth your time

Nobody grows up wanting to parse PDFs.

But the invoice, the policy, the meeting minutes, the report the board actually
reads — all of it lives in these formats, and all of it is currently being
copied out by hand by somebody who does not know it can be otherwise. The
bureaucracy is not going to stop producing documents. It is simply waiting for
someone who can read them faster than it can write them.
