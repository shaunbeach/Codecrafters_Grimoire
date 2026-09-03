Build the panel first and print a few of them at different widths. If every line
is the same length, the hard part is done.
---
For the panel: a `border` string and a `row(content)` helper that returns
`"| " + content.ljust(width - 4) + " |"`. Then assemble: border, optional title
and border, the wrapped lines, border.

For the replies: split the message into words, strip punctuation off each, and
lower them — then test set membership.
---
```python
def render_panel(text, title="", width=40):
    border = "+" + "-" * (width - 2) + "+"

    def row(content):
        return "| " + content.ljust(width - 4) + " |"

    lines = [border]
    if title:
        lines += [row(title), border]
    for line in textwrap.wrap(text, width - 4) or [""]:
        lines.append(row(line))
    lines.append(border)
    return "\n".join(lines)
```

And the words: `{w.strip(".,!?;:'\"").lower() for w in message.split()}`.
