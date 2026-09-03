## The situation

Half the inscriptions in the guildhall were carved by apprentices in a hurry.
Some are all capitals. Some are all lowercase. Most have too much space between
the words where the chisel slipped.

The archivist wants them all reading the same way: every word beginning with a
capital, one space between them, nothing on either end.

## What good looks like

```python
read_runes("the rusty tankard")
# 'The Rusty Tankard'

read_runes("THE RUSTY TANKARD")
# 'The Rusty Tankard'

read_runes("  the   rusty   tankard  ")
# 'The Rusty Tankard'

read_runes("")
# ''
```

## Your objective

**`read_runes(text)`** — return the inscription with every word capitalised, one
single space between words, and no space at either end.

Empty text, or text that is nothing but spaces, returns an empty string.

## Watch out for

`.capitalize()` does two things: it raises the first letter **and lowers the
rest**. That is what turns `THE` into `The`, and it is why it is the right tool
here rather than `.upper()` on the first character.

`.split()` with no argument splits on any run of whitespace and throws the empty
pieces away — which handles the slipped chisel for free.
