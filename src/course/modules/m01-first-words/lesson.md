# The Threshold

Every apprentice begins the same way, and it is not with fire.

You will be handed a piece of chalk and asked to make a mark that the world can
read. That is all a program is at the start: you say a thing, and something that
is not you says it back. Get comfortable here. Everything else in this grimoire
is built on the day you first made the machine speak.

## Speaking

```python
print("Hello, Adventurer")
```

`print()` takes whatever you hand it and writes it out. The quotes matter — a
piece of text is a **string**, and the quotes are what tell Python it is text
rather than the name of something you have already made.

Single or double, as long as they match:

```python
print('Single quotes are fine')
print("Use doubles when the words have an apostrophe: it's easier")
```

Each `print()` starts a new line. Two calls, two lines. Give it several things
at once and it joins them with a space:

```python
print("Level", 3, "Wizard")     # Level 3 Wizard
```

## Marks that are hard to type

Some characters cannot simply be typed inside a string, so Python smuggles them
in behind a backslash:

| You write | You get |
| --- | --- |
| `\n` | a new line |
| `\t` | a tab |
| `\"` | a literal double quote |
| `\\` | a literal backslash |

```python
print("Above\nBelow")
```

```
Above
Below
```

## Repetition, cheaply

`*` on a string repeats it. This is how you rule a line without pressing the
same key forty times:

```python
print("-" * 20)     # --------------------
print("ab" * 3)     # ababab
```

And `len()` tells you how many characters a string holds. Put the two together
and you can draw a rule exactly as wide as the words above it — which is a very
small piece of magic, and the first one that will feel like yours:

```python
title = "Kira the Bold"
print(title)
print("=" * len(title))
```

```
Kira the Bold
=============
```

## Naming things

A variable is a name pointing at a value. You make one with `=`:

```python
bill = 100
tip_rate = 0.15
tavern = "The Rusty Tankard"
```

Lowercase, with underscores between words. `total_with_tip`, not `TotalWithTip`
or `x2`. You will read your own names far more often than you write them.

## Numbers come in two kinds

```python
people = 4        # int   — a whole number
bill = 56.70      # float — a number with a decimal point
```

| Operator | Does | Example |
| --- | --- | --- |
| `+` `-` `*` | the obvious | `3 * 4` → `12` |
| `/` | division, always a float | `7 / 2` → `3.5` |
| `//` | floor division | `7 // 2` → `3` |
| `%` | remainder | `7 % 2` → `1` |
| `**` | power | `2 ** 10` → `1024` |

Try this, and be unsettled by it:

```python
print(0.1 + 0.2)     # 0.30000000000000004
```

That is not a flaw in Python. It is what happens when a decimal is stored in
binary, and it is true of nearly every language you will ever use. The lesson is
simple: **never show a raw float to a person.** Format it first.

## Putting values into sentences

Put an `f` before a string and Python will work out anything inside `{}`:

```python
name = "Kira"
level = 7
print(f"{name} is level {level}")        # Kira is level 7
print(f"Next level: {level + 1}")        # Next level: 8
```

A colon inside the braces says *how* the value should look:

```python
share = 28.749999
print(f"${share:.2f}")      # $28.75   — two decimals, rounded
print(f"{0.15:.0%}")        # 15%
print(f"{1234567:,}")       # 1,234,567
```

`:.2f` is the one you will reach for constantly, because it both rounds **and**
pads: `5` becomes `5.00`, not `5`.

## Asking

```python
name = input("What is your name? ")
```

`input()` always hands back a **string**, even when the person typed digits. To
do arithmetic with it you must convert:

```python
people = int(input("How many people? "))
bill = float(input("What was the bill? "))
```

Forgetting that conversion is the most common beginner mistake there is —
`"4" * 3` is `"444"`, not `12`.

## Speaking versus handing back

One last distinction, and it matters more than it looks.

`print()` says something to a person. **`return` hands a value back to the rest
of your program**, so it can be used for something else:

```python
def make_title(name):
    return "The Legend of " + name

print(make_title("Kira"))       # The Legend of Kira
```

A working that prints has spoken once and is finished. A working that returns
has made something. In this module you will do both, and you will feel the
difference the first time a test asks for a value and your code has only said it
aloud.
