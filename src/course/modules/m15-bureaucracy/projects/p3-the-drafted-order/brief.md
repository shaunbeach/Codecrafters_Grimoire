## The situation

Reading the bureaucracy is half of it. The other half is producing paperwork it
will accept — and producing it with real structure, so that the next programme
along can read it back the way you just read the report.

## What good looks like

```python
draft_order(
    "/workspace/order.docx",
    "Order of Supply",
    [("Rope", ["Forty fathoms", "Delivered by Friday"]),
     ("Lanterns", ["Six, oil-fed"])],
)
# 2
```

The document:

```
Title       Order of Supply
Heading 1   Rope
List Bullet Forty fathoms
List Bullet Delivered by Friday
Heading 1   Lanterns
List Bullet Six, oil-fed
```

## Your objective

**`draft_order(path, title, sections)`** — write a Word document and return the
number of sections written.

- the `title` is a Title (`add_heading(..., level=0)`)
- each section's name is a `Heading 1`
- each of its lines is a paragraph with `style="List Bullet"`
- sections with no lines still get their heading

## Watch out for

Use the real style names. A "heading" made by writing bold text in a Normal
paragraph *looks* like a heading and carries none of the meaning — the outline
you wrote in the last working would not find it, and neither would Word's
navigation pane.

That is the whole point of this format. Structure that is only visual is not
structure.
