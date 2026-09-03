# The Ledger

A list answers "what is at position 3?".

A **dictionary** answers "how many health potions do I have?" — which, you will
notice, is the question you actually had.

## Keys and values

```python
inventory = {"health_potion": 3, "gold": 50, "rope": 1}
```

Every entry is a `key: value` pair. You look things up by key, and position does
not enter into it:

```python
inventory["gold"]           # 50
inventory["gold"] = 75      # replace
inventory["torch"] = 2      # a new entry, created simply by assigning to it
```

Keys must be unchangeable things — strings and numbers, in practice. Values can
be anything at all, including lists and other dictionaries.

## The missing key

Asking for something that is not there raises `KeyError` and stops your program:

```python
inventory["sword"]          # KeyError: 'sword'
```

Three ways to live with that:

```python
if "sword" in inventory:            # ask first
    print(inventory["sword"])

inventory.get("sword")              # None instead of an explosion
inventory.get("sword", 0)           # a default of your choosing
```

`.get(key, 0)` is the workhorse of every counting program ever written, because
it lets you say this:

```python
inventory[name] = inventory.get(name, 0) + amount
```

That single line adds to an existing count **or** starts a new one at zero. No
`if`. Learn it; you will write it hundreds of times.

## Taking things out

```python
del inventory["rope"]            # KeyError if absent
inventory.pop("rope", None)      # hands back the value, or the default
```

## Walking a dictionary

```python
for name in inventory:                       # keys
    print(name)

for name, count in inventory.items():        # keys AND values
    print(f"{name}: {count}")

for count in inventory.values():             # values only
    print(count)
```

`.items()` gives you both halves at once and is what you want nine times in ten.

Dictionaries remember the order things were put in. If you want a *predictable*
order instead — one that does not depend on the order somebody happened to add
things — sort the keys:

```python
for name in sorted(inventory):
    print(name)
```

Any report a person will read should be sorted. A report whose row order changes
between runs cannot be compared with last week's.

## Small mercies

```python
len(inventory)                   # how many entries
sum(inventory.values())          # the total of all counts
"gold" in inventory              # membership tests KEYS, not values
```

That last one surprises people. `in` on a dictionary asks about keys.

## Counting things

The most common dictionary program there is: walk something, and tally what you
find.

```python
counts = {}
for letter in "mississippi":
    counts[letter] = counts.get(letter, 0) + 1

counts       # {'m': 1, 'i': 4, 's': 4, 'p': 2}
```

Four lines, and it works on letters, words, dice rolls, error codes, or anything
else you can loop over.

## Strings are sequences too

A string behaves much like a list of characters:

```python
word = "python"
word[0]           # 'p'
word[-1]          # 'n'
len(word)         # 6

for letter in word:
    print(letter)
```

The difference: strings are **immutable**. `word[0] = "P"` is an error. To change
a string you build a new one:

```python
result = ""
for letter in "abc":
    result += letter.upper()
```

For short text that is fine. For long text, collect the pieces in a list and use
`"".join(pieces)` — far faster, because each `+=` on a string makes a whole new
string.

## Letters are numbers underneath

Every character has a number. `ord()` gives it to you, `chr()` turns it back:

```python
ord("a")     # 97
ord("z")     # 122
chr(97)      # 'a'
```

The lowercase alphabet is 26 consecutive numbers from 97, so "shift a letter by
three" is arithmetic:

```python
chr(ord("a") + 3)     # 'd'
```

And to make `z` wrap round to `c` instead of running off into punctuation, the
remainder does the work:

```python
position = ord("z") - ord("a")          # 25
new_position = (position + 3) % 26      # 2
chr(ord("a") + new_position)            # 'c'
```

That `% 26` is the entire trick of every shift cipher there has ever been. It
also makes negative shifts work without any extra code, which is why decoding
falls out of encoding for free.

## Doing the arithmetic once

Rather than computing a shift on every letter, do it once and store the answers:

```python
cipher = {}
for i in range(26):
    cipher[chr(97 + i)] = chr(97 + (i + 3) % 26)

cipher["a"]     # 'd'
cipher["z"]     # 'c'
```

Then translating is only lookups — and `.get(letter, letter)` lets anything that
is not a lowercase letter pass through untouched:

```python
"".join(cipher.get(ch, ch) for ch in "attack at dawn!")
```

A table you build once and consult many times is one of the oldest ideas in
programming. You have just written your first one.
