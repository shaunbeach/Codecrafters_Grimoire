# The Fault

Every apprentice writes code that works.

The difference between an apprentice and an artisan is what happens next: the
thing leaves the workshop, and somebody who is not you picks it up and does
something you never imagined. They type their name into the age field. They run
it on a Tuesday when the file is not there. They feed it a spreadsheet with one
empty cell in the middle.

A thing that breaks on your bench is a lesson. A thing that breaks in someone
else's hands is a failure — and it is a failure of the maker, not the user.

This module is about making things that hold.

## An exception is not a bug

When Python cannot do what you asked, it **raises**. It stops the current line
and searches back up through the workings that called it, looking for anyone who
has volunteered to deal with the problem. If nobody has, the programme dies and
prints a traceback.

```python
int("banana")
```

```
Traceback (most recent call last):
  File "solution.py", line 1, in <module>
    int("banana")
ValueError: invalid literal for int() with base 10: 'banana'
```

**Read a traceback from the bottom.** The last line is what went wrong. The
lines above it are the path your programme took to get there, most recent last.
People skim the top and get lost; the answer is nearly always the bottom two
lines.

## Catching one

```python
try:
    number = int(text)
except ValueError:
    number = 0
```

The `try` block runs. If it raises the kind of thing you named, the `except`
block runs instead, and the programme carries on.

## Catch what you expect, and nothing else

```python
try:
    ...
except Exception:     # too broad
    pass              # and now the error is invisible
```

That pattern will swallow your own typos and hide them for hours. `except:` with
nothing after it is worse still — it catches even Ctrl-C.

Name the thing you are prepared for:

| Exception | When |
| --- | --- |
| `ValueError` | right type, impossible value — `int("banana")` |
| `TypeError` | wrong type entirely — `len(5)` |
| `KeyError` | a dictionary key that is not there |
| `IndexError` | a list position that is not there |
| `ZeroDivisionError` | dividing by zero |
| `FileNotFoundError` | opening a file that is not there |

Several at once, when they genuinely deserve the same answer:

```python
except (ValueError, TypeError):
```

## Looking at what you caught

```python
try:
    int(text)
except ValueError as exc:
    print(f"Could not read that: {exc}")
```

## else and finally

```python
try:
    handle = open(path)
except FileNotFoundError:
    print("no such file")
else:
    print("opened fine")     # only when nothing was raised
finally:
    print("done")            # always, raised or not
```

`finally` is for cleanup that must happen either way. `with` is usually the
tidier way to get the same guarantee, which is why you meet `finally` less often
than you might expect.

## Raising your own

```python
if weight <= 0:
    raise ValueError(f"weight must be positive, got {weight}")
```

Raise when a caller has handed you something you genuinely cannot work with.

Returning `None` in that situation feels gentler and is not: it moves the crash
somewhere further away, into code that had nothing to do with the mistake, where
it is far harder to trace back. **Fail where the problem is.**

And put the offending value in the message. `"invalid weight"` sends somebody
hunting; `"weight must be positive, got -4"` ends the search immediately.

## The retry loop

Combine `while True` with `try` and you have the pattern behind every robust
prompt ever written:

```python
while True:
    try:
        return int(input(prompt))
    except ValueError:
        print("That is not a whole number.")
```

The `return` inside the `try` is what ends the loop. Bad input falls through to
the `except`, prints, and goes round again. It cannot get stuck, and it cannot
crash.

## Writing down what happened

When something goes wrong at three in the morning on a machine you cannot see,
`print()` is no use to anybody. `logging` writes to a file instead:

```python
import logging

logging.basicConfig(
    filename="run.log",
    level=logging.DEBUG,
    format="%(levelname)s: %(message)s",
    force=True,
)

logging.debug("starting with %s rows", len(rows))
logging.warning("skipping negative value: %s", value)
logging.error("could not open %s", path)
```

Five levels, in order of how much you want to be woken up: `DEBUG`, `INFO`,
`WARNING`, `ERROR`, `CRITICAL`. `level=` sets the lowest one that gets written,
so you can turn the detail up without editing a line of code.

`force=True` matters in a long-lived programme: `basicConfig` quietly does
nothing if logging has already been set up, which is a genuinely baffling
half-hour the first time it happens to you.

## Assertions are for you, not for them

```python
assert 0 <= chance <= 1, f"chance must be a fraction, got {chance}"
```

An `assert` says "this should be impossible". It is a note to yourself about
what you believe, and it fires the moment that belief turns out to be wrong.

It is **not** input validation. Python can be run with assertions switched off
entirely, so anything you actually need enforced must be an `if` and a `raise`.
Assert your assumptions; raise on their mistakes.
