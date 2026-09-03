## The situation

A five-page writ arrives, and the guild needs pages one, three and five sent on
to the assessor. Not the whole thing — the assessor charges by the page.

## What good looks like

```python
extract_pages("/workspace/writ.pdf", "/workspace/extract.pdf", [0, 2, 4])
# 3
```

`extract.pdf` now has three pages, in that order, and the original is untouched.

## Your objective

**`extract_pages(source, destination, pages)`** — read `source`, take the pages
at those **0-indexed** positions, write them to `destination`, and return how
many pages were written.

A position that does not exist is skipped rather than fatal — an assessor asking
for page nine of a five-page writ has made a mistake worth surviving.

## Watch out for

Open the destination in **binary** mode: `open(destination, "wb")`. A PDF is
bytes, and `"w"` gives you a `TypeError` from inside the library.

`pages` are 0-indexed here while every human discussing the document counts from
1. That mismatch is real and permanent; the only defence is naming your
variables so it is obvious which you mean.
