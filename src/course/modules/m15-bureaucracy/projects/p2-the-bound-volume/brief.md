## The situation

A ninety-page report has arrived and somebody would like to know what is
actually in it before reading it.

A PDF could not tell you. A `.docx` can — because it knows which paragraphs are
headings and which are body text, and that difference is real information rather
than a guess about font sizes.

## What good looks like

```python
outline("/workspace/report.docx")
# [(0, 'Quarterly Review'), (1, 'Findings'), (1, 'Recommendations')]
```

The document itself:

```
Title       Quarterly Review
Heading 1   Findings
Normal      Sales rose in the North.
Normal      (empty)
Heading 1   Recommendations
Normal      Buy more rope.
List Bullet Ropes
```

## Your objective

**`outline(path)`** — return a list of `(level, text)` tuples, in document order,
for every heading.

- a paragraph styled `Title` is level `0`
- `Heading 1` is level `1`, `Heading 2` is level `2`, and so on
- body text, list items and empty paragraphs are not headings

## Watch out for

The style name is on `paragraph.style.name`, and it is a string like
`'Heading 1'` — the level is the number at the end of it.

Word inserts empty paragraphs whenever somebody presses Enter twice. They are
real objects with real styles, and skipping them is not optional.

`'List Bullet'` is a style, not a heading. Test for the exact shape you want
rather than for anything that is not `'Normal'`.
