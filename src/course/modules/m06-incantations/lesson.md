# The Workshop

You have been using workings since your first day. Now you learn to make them —
which is the point at which you stop writing scripts and start building things.

A programme of any size is not clever code. It is a set of well-chosen seams.

## The shape of one

```python
def greet(name):
    return f"Hello, {name}."
```

- `def` begins the definition
- `name` is a **parameter** — a placeholder for something the caller supplies
- the body is indented
- `return` hands a value back and ends the working immediately

Defining a working runs none of it. Nothing happens until you **call** it:

```python
message = greet("Kira")     # 'Kira' is the argument
```

## Speaking versus handing back, again

The most common mistake of the first month:

```python
def add(a, b):
    print(a + b)        # shows the answer, hands back None

total = add(2, 3)       # total is None. You cannot use it for anything.
```

`print` talks to a person. `return` talks to the rest of your programme. A
working with no `return` returns `None`.

Reach for `print` only at the outer edge, where your code actually meets a
human. Everything inside should be handing values back.

## Optional parts

Give a parameter a default and it becomes optional:

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}."

greet("Kira")                 # 'Hello, Kira.'
greet("Kira", "Well met")     # 'Well met, Kira.'
```

Parameters with defaults come **after** those without.

⚠️ **Never use a mutable default.** `def f(items=[])` creates that list *once*,
when the working is defined, and every call shares it:

```python
def bad(items=[]):
    items.append("x")
    return items

bad()    # ['x']
bad()    # ['x', 'x']   — the same list, still there
```

Use `None` and build a fresh one inside:

```python
def good(items=None):
    if items is None:
        items = []
```

## Naming your arguments

```python
greet("Kira", "Captain", True)                    # by position
greet("Kira", excited=True)                       # by name, skipping the middle
greet(name="Kira", title="Captain")               # all by name, order irrelevant
```

Keyword arguments make a call explain itself. `render(True, False, True)` is
unreadable at a glance; `render(bold=True, italic=False, underline=True)` is
not.

## Handing back more than one thing

```python
def roll_attack(power, defence):
    damage = max(1, power - defence)
    return damage, False
```

What comes back is a **tuple** — a list that cannot be changed. Usually you
unpack it straight into names:

```python
damage, was_critical = roll_attack(10, 4)
```

The count must match, or you get a `ValueError`. When you genuinely do not care
about one of them, the convention is `_`.

## Workings made of workings

```python
def is_critical(chance=0.2):
    return random.random() < chance


def roll_attack(power, defence):
    damage = max(1, power - defence)
    if is_critical():
        return damage * 2, True
    return damage, False
```

Each does one thing. Each has one reason to change. Each can be checked on its
own.

When a working starts getting long, look for the noun buried in the middle of it
and pull that out. That instinct — not any particular syntax — is the thing this
module is really teaching.

## Clamping

`max()` and `min()` keep a number inside sensible bounds:

```python
damage = max(1, power - defence)      # never below 1
health = max(0, health - damage)      # never negative
strength = min(100, strength + 5)     # never above 100
```

An attack that heals its target because the defence was high is the sort of bug
that costs an afternoon. Clamp at the source.

## Scope

Names made inside a working exist only there:

```python
def f():
    secret = 1

f()
print(secret)        # NameError — it never escaped
```

That isolation is the feature. It is what lets you reason about a working
without holding the rest of the programme in your head.

## Workings as values

A working is a value like any other. You can put one in a dictionary:

```python
COMMANDS = {"set": do_set, "add": do_add, "list": do_list}

handler = COMMANDS.get(verb)
if handler is None:
    return f"unknown command: {verb}"
return handler(store, arguments)
```

Note `do_set` with no brackets — that is the working itself. `do_set()` **with**
brackets would call it right now and store the result instead.

Adding a new command becomes one dictionary entry rather than another `elif`.

## Workings in other files

A module is just a `.py` file. If `dice.py` sits beside your script:

```python
import dice

dice.roll()          # call something from it
dice.DEFAULT_SIDES   # read something from it
```

`import dice` runs that file once, top to bottom, and hands you an object
holding everything it defined. The dot is a **namespace** — it keeps `dice.roll`
and your own `roll` from colliding.

```python
from dice import roll             # pull one name in
from dice import roll, roll_many  # or several
import dice as d                  # rename it
from dice import *                # DON'T
```

The star import empties every name into your file, so you can no longer tell
where anything came from, and a new working in `dice` can silently shadow one of
yours. Every style guide forbids it.

## The guard at the bottom

You will see this at the foot of nearly every Python file:

```python
if __name__ == "__main__":
    print(roll())
```

`__name__` is set by Python. It is `"__main__"` when the file is the one you
**ran**, and the module's own name when it was **imported**. So the guarded
block fires when you run the file directly and stays quiet when someone imports
it.

Without it, importing a module would set off all its demonstration code — and in
this grimoire, it is also what lets you put a try-it-out call at the bottom of
your work without it interfering when you are graded.
