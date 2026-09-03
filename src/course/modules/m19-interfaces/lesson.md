# The Gallery

The last thing anybody sees is the thing they judge.

You can write a working of real cleverness, and if it prints a wall of unaligned
text somebody will call it broken. You can write something ordinary, and if it
lays itself out well they will trust it. That is not fair, and it is completely
true, and it costs about fifteen lines.

## Padding

Every string knows how to pad itself:

```python
"gold".ljust(10)        # 'gold      '
"gold".rjust(10)        # '      gold'
"gold".center(10)       # '   gold   '
"gold".center(10, "-")  # '---gold---'
```

That is how columns line up:

```python
for name, count in inventory.items():
    print(f"{name:<15}{count:>4}")
```

f-strings do it inline — `<` left, `>` right, `^` centre:

```python
print(f"{title:^40}")
print(f"{'':-^40}")        # a rule of dashes, 40 wide
```

**Numbers right, text left.** Right-aligned digits let the eye compare
magnitudes down a column; left-aligned ones do not. It is a small rule that
makes a table instantly readable.

## Drawing a frame

A box is three kinds of line:

```
+--------------------------------------+
| PythonBot                            |
+--------------------------------------+
| Hello there!                         |
+--------------------------------------+
```

For a box `width` wide: the border is `+` plus `width - 2` dashes plus `+`, and
each content line is `"| "`, the text padded to `width - 4`, then `" |"`.

Every line comes out **exactly** `width` characters. That is the property that
makes it read as a box rather than a rhombus, and it is worth asserting while
you build it.

For long text, wrap first:

```python
import textwrap
lines = textwrap.wrap(text, width - 4) or [""]
```

That `or [""]` matters: `textwrap.wrap("")` returns an **empty list**, and a box
with no content lines collapses into two borders stuck together.

## Rich, when you want the real thing

```
pip install rich
```

```python
from rich.console import Console
from rich.table import Table

console = Console()
table = Table(title="Inventory")
table.add_column("Item")
table.add_column("Count", justify="right")
table.add_row("Rope", "4")
console.print(table)
```

Rich draws proper Unicode boxes, colours, progress bars and syntax highlighting,
and it solves the terminal-width and emoji-width problems that will otherwise
eat an afternoon.

Build a box by hand once so you understand what it is doing. Then use Rich.

## The conversation loop

```python
while True:
    message = input("> ")
    reply = reply_to(message)
    print(render_panel(reply, title="PythonBot"))
    if reply == "Goodbye!":
        break
```

Keep the *deciding* out of the loop. `reply_to` can be checked a hundred times
without anybody typing; the loop cannot. That separation is the same one you met
in the quiz, and it is the difference between a programme you can test and one
you can only try.

## Matching words, not substrings

```python
if "hi" in message:            # matches "this", "history", "chile"
if "hi" in message.split():    # matches only the word "hi"
```

Split into words before you check. Substring matching on natural language
produces bugs that are genuinely funny right up until they are yours.

## Sending word beyond the room

```python
import smtplib
from email.message import EmailMessage

message = EmailMessage()
message["From"] = "guild@example.com"
message["To"] = "kira@example.com"
message["Subject"] = "The quarterly review"
message.set_content("It is attached.")

with smtplib.SMTP("smtp.example.com", 587) as server:
    server.starttls()
    server.login(user, password)
    server.send_message(message)
```

`starttls()` upgrades the connection to an encrypted one, and without it your
password crosses the network in the clear.

The password does not go in your source. It goes in an environment variable, and
for most real services it is an *app-specific* password rather than your account
one — so that a leaked script costs you one integration rather than your entire
mailbox.

> Nothing here can send real mail from a browser tab, and the checks replace the
> server entirely. What you write is the code that would send it.
