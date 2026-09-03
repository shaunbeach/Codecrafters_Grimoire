## The situation

The guild's tools all print walls of unaligned text, and everybody assumes they
are broken. They are not broken. They are simply ugly, and nobody trusts an ugly
tool.

Press **Run** and it will talk to you — it genuinely waits for what you type.

## What good looks like

```
+--------------------------------------+
| PythonBot                            |
+--------------------------------------+
| Hello there!                         |
+--------------------------------------+
```

```python
chat()      # typing: 'hello', 'how are you?', 'bye'
# ['Hello there!', 'That is a good question.', 'Goodbye!']
```

## Your objective

**`render_panel(text, title="", width=40)`** — return a framed block, no
trailing newline, with **every line exactly `width` characters**. With no title,
the title row and its border are omitted. Long text wraps; empty text still
gives one blank content line.

**`reply_to(message)`** — the rules, in this order:

| When | Reply |
| --- | --- |
| empty or only whitespace | `'Say something!'` |
| contains the word `bye`, `goodbye` or `quit` | `'Goodbye!'` |
| contains the word `hello`, `hi` or `hey` | `'Hello there!'` |
| ends with `?` | `'That is a good question.'` |
| anything else | `'Tell me more.'` |

**`chat()`** — loop on `input("> ")`, print each reply as a panel titled
`PythonBot`, and stop after replying `'Goodbye!'`. Return the list of replies. If
the input runs out (`EOFError`), stop cleanly and return what you have.

## Watch out for

`textwrap.wrap("")` returns an **empty list**, so a panel for empty text
collapses into two borders with nothing between them. `or [""]` is the fix.

Match whole words, not substrings. `"this"` contains `hi`, and a bot that greets
you when you say "this" is a bot people screenshot.

Order matters: "hello and bye" is a farewell, because farewells are checked
first.
