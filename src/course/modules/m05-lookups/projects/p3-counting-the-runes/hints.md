An empty dictionary before the loop, one letter at a time inside it, return
after. Two decisions per letter: should it be counted at all, and what is its
new tally.
---
`letter.isalpha()` decides whether to count it. `letter.lower()` makes `A` and
`a` the same key.

Then the line you met in the lesson:
`counts[key] = counts.get(key, 0) + 1`.
---
```python
counts = {}
for character in text:
    if not character.isalpha():
        continue
    letter = character.lower()
    counts[letter] = counts.get(letter, 0) + 1
return counts
```
