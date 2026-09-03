# The Crossroads

A working that always does the same thing is a very expensive piece of paper.
You could have written the answer down once and saved yourself the trouble.

What makes it magic is that it *chooses*. You hand it a situation you have never
seen, and it decides. That is this module, and it is the shortest distance
between "I typed some Python" and "I made a thing that does something".

## Questions have answers

```python
age = 19
print(age > 18)      # True
print(age == 21)     # False
```

`True` and `False` are values, of type `bool`. Every comparison produces one.

| Operator | Asks |
| --- | --- |
| `==` | are these equal? |
| `!=` | are these different? |
| `<` `>` | less / greater |
| `<=` `>=` | less / greater, or equal |

**`=` gives a name to a value. `==` asks a question.** Confusing them is a rite
of passage; Python will usually stop you, but not always.

## Acting on the answer

```python
age = 19

if age >= 18:
    print("Come in.")
```

Two things are load-bearing here:

1. the line ends in a **colon**
2. the body is **indented** — four spaces, consistently

Indentation is not decoration in Python. It *is* the syntax; it is how the
language knows where the `if` begins and ends. Other languages use braces and
let you lay the code out however you like. Python decided that if the shape has
to be right anyway, it may as well be the thing that counts.

## More than two roads

```python
if age >= 21:
    print("Full menu.")
elif age >= 18:
    print("Soft drinks only.")
else:
    print("Off you go.")
```

Python tests each condition **in order** and runs the body of the *first* one
that is true. Everything after it is skipped — even if it would also have been
true.

That is why order is everything:

```python
# Wrong. The first branch swallows everyone.
if age >= 18:
    print("Adult")
elif age >= 65:
    print("Elder")     # never reached: 70 already matched above
```

**Put the most specific condition first.** When a chain of `elif`s misbehaves,
this is almost always why.

## Joining questions together

```python
if age >= 18 and has_id:
    print("Come in.")

if not has_id:
    print("No ID, no entry.")

if day == "Friday" or day == "Saturday":
    print("Live music tonight.")
```

`and` needs both sides true. `or` needs either. `not` flips one over.

Python also stops early: in `a and b`, if `a` is false it never looks at `b`.
That is **short-circuiting**, and it lets you write `if items and items[0]`
without fear — the second half only runs when the first half made it safe.

## Everything can be asked

Any value can be tested directly. Empty things are false; everything else is
true:

```python
if name:            # true when name is not an empty string
    print(f"Hello {name}")
```

Falsy: `0`, `0.0`, `""`, `[]`, `{}`, `None`, `False`. That is the whole list, and
it is worth learning, because `if not tasks:` reads far better than
`if len(tasks) == 0:`.

## Decisions inside decisions

An `if` body can hold another `if`:

```python
if door == "left":
    if enemy == "goblin":
        print("You fight the goblin.")
    else:
        print("The room is empty.")
else:
    print("You go right instead.")
```

Each level is another four spaces. Python reads the indentation to work out
which `if` an `else` belongs to, so one stray space genuinely changes what your
program means.

Before you write a branching story, sketch it:

```
        start
       /     \
    left     right
    /  \      /   \
 fight flee  open  knock
```

Four leaves, four endings, four `return`s.

## Leaving early

A `return` ends the working immediately. Nothing after it runs — which means you
often do not need `else` at all:

```python
def describe(door):
    if door == "left":
        return "A cold corridor."
    if door == "right":
        return "A warm kitchen."
    return "You stand still."      # only reached if neither matched
```

This is a **guard clause**. Handle the awkward cases at the top, get them out of
the way, and let the interesting part of the working sit flat and unindented at
the bottom. Code written this way is markedly easier to read, and you will see
it everywhere once you start looking.

## People type messily

`"Left"`, `"LEFT"` and `" left "` are three different strings as far as `==` is
concerned. Normalise before you compare:

```python
answer = input("Which way? ").strip().lower()
```

`.strip()` removes whitespace from both ends; `.lower()` puts it all in
lowercase. Two method calls, and an entire category of bug reports disappears.
