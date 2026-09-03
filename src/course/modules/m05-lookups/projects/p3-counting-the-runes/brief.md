## The situation

A stone has been dragged in covered in carvings, and the archivist wants to know
which runes appear most often — the frequency is how you break a cipher like the
one you just wrote.

## What good looks like

```python
count_runes("mississippi")
# {'m': 1, 'i': 4, 's': 4, 'p': 2}

count_runes("Attack At Dawn")
# {'a': 4, 't': 3, 'c': 1, 'k': 1, 'd': 1, 'w': 1, 'n': 1}

count_runes("")
# {}
```

## Your objective

**`count_runes(text)`** — return a dictionary of `{letter: count}`.

- only letters are counted; spaces, punctuation and digits are ignored
- case does not matter: `A` and `a` are the same rune

## Watch out for

This is the counting pattern in its purest form, and it is four lines long. If
you find yourself writing an `if` to check whether the letter is already in the
dictionary, look again at what `.get(key, 0)` is for.

`"a".isalpha()` is `True`; `" ".isalpha()` is `False`. That is your filter.
