## The situation

Two companies are about to march on the same keep from opposite sides, and
somebody would like to know which names appear on both rosters before the
arrows start.

## What good looks like

```python
common_allies(["Kira", "Bo", "Rex"], ["Rex", "Ana", "Kira"])
# ['Kira', 'Rex']

common_allies(["Kira", "Kira", "Bo"], ["Kira"])
# ['Kira']

common_allies(["Kira"], ["Ana"])
# []
```

## Your objective

**`common_allies(a, b)`** — return the names that appear in **both** lists,
sorted alphabetically, with no name listed twice.

Neither roster is modified.

## Watch out for

A name repeated on one roster is still one person. The result must not contain
duplicates.

`in` is the whole of the test: `name in b` asks whether that name appears
anywhere in the second list.

There is a one-line version of this using `set`, and it is what you would reach
for in real code. Write the loop version first — knowing what the shortcut is
doing for you is the point of the drill.
