# The Pack

You have carried one value at a time. That works until the moment you need
twelve, and then it collapses — because you cannot name twelve things and you
certainly cannot name a number of things you do not know yet.

A **list** is the first real container. It holds as many values as you like, in
order, and it can grow.

## Making one

```python
adjectives = ["Grim", "Swift", "Ancient"]
levels = [1, 5, 12, 40]
mixed = ["Kira", 7, True]          # legal, but usually a smell
empty = []
```

## Taking things out

Positions start at **0**:

```python
adjectives[0]      # 'Grim'
adjectives[2]      # 'Ancient'
adjectives[-1]     # 'Ancient'   — negative counts back from the end
adjectives[-2]     # 'Swift'
```

Reaching past the end raises `IndexError`. `len()` says how many there are, so
the last valid position is always `len(items) - 1` — which is exactly why
counting from 0 is less annoying than it first appears.

```python
len(adjectives)    # 3
```

## Taking a slice

Two positions with a colon takes a section. Same rule as `range`: start
included, stop excluded.

```python
letters = ["a", "b", "c", "d", "e"]
letters[1:3]     # ['b', 'c']
letters[:2]      # ['a', 'b']
letters[2:]      # ['c', 'd', 'e']
letters[:]       # a full copy
```

That last one matters more than it looks. Hold on to it.

## Lists can be changed

Unlike a string, a list can be altered where it stands:

```python
party = ["Kira"]
party.append("Bo")        # add one to the end     -> ['Kira', 'Bo']
party.extend(["Ana"])     # add several
party.insert(0, "Rex")    # add at a position, pushing the rest along
party[0] = "Rexley"       # replace
```

`append` adds **one** thing. Append a list and you get a list inside your list,
which is rarely what anyone wanted.

And three ways to remove, for three different jobs:

```python
party.remove("Bo")     # find this value and delete it — ValueError if absent
party.pop()            # remove and RETURN the last one
party.pop(0)           # remove and RETURN the first one
del party[1]           # delete by position, returns nothing
party.clear()          # empty it
```

The difference is whether you get the thing back. `pop` hands it to you;
`remove` and `del` throw it away. Use `pop` when you intend to do something with
what you removed.

## Look before you leap

`remove` and `pop` both raise when there is nothing to act on. The polite guard
is short:

```python
if "Bo" in party:
    party.remove("Bo")

if party:                  # an empty list is falsy
    next_up = party.pop(0)
```

`in` works on lists, strings and dictionaries alike, and it reads like English.
Use it.

## The trap: changing versus returning

This catches everyone exactly once:

```python
names = ["b", "a"]
result = names.sort()        # result is None!
print(names)                 # ['a', 'b'] — the list itself changed
```

`sort()`, `append()`, `reverse()` change the list **in place** and hand back
`None`. If you want a new sorted list and the original left alone, that is a
different tool:

```python
ordered = sorted(names)      # a new list; names is untouched
```

The rule of thumb: **methods on the list change it; built-in functions make a
new one.** `list.sort()` versus `sorted(list)`. `list.reverse()` versus
`reversed(list)`.

## Two names, one list

```python
a = ["x"]
b = a
b.append("y")
print(a)      # ['x', 'y']
```

`b = a` did not copy anything. It gave a second name to the same list. Both
names see every change, because there is only one list.

This is not a flaw — it is how you pass a list to a working and have that
working change it:

```python
def add_task(tasks, description):
    tasks.append(description)

my_tasks = []
add_task(my_tasks, "buy rope")
print(my_tasks)      # ['buy rope']
```

When you genuinely want an independent copy, ask for one: `a[:]` or `list(a)`.
Knowing which of the two you meant is most of what separates a working that
behaves from one that mysteriously does not.

## Walking a list

```python
for name in party:
    print(f"- {name}")
```

And when you need the position as well, `enumerate` hands you both:

```python
for index, name in enumerate(party, start=1):
    print(f"{index}. {name}")
```

`start=1` is there because people count from one even when computers do not.

## Picking at random

```python
import random

random.choice(adjectives)             # one item
random.sample(adjectives, 2)          # two different ones
random.shuffle(adjectives)            # reorders in place, returns None
```

`random.choice` on an empty list raises `IndexError` — there is nothing to pick.
