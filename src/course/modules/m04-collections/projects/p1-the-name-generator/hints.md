`random.choice(a_list)` gives you one item from it. You need two of those and an
f-string to put them together.
---
For the party: make an empty list, loop `size` times, and append the result of
calling `generate_name` each time.

`for _ in range(size):` is the idiom when the loop variable is not used for
anything — the underscore is a name that says "I know, and I do not need it".
---
```python
def generate_name(adjectives, nouns):
    return f"{random.choice(adjectives)} {random.choice(nouns)}"


def generate_party(adjectives, nouns, size):
    party = []
    for _ in range(size):
        party.append(generate_name(adjectives, nouns))
    return party
```
