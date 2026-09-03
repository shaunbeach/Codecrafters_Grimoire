## The situation

Every apprentice needs a name to be shouted at the door, and the guild has run
out of ideas. There are two lists on the wall — one of adjectives, one of nouns
— and the tradition is to take one of each.

## What good looks like

```python
generate_name(["Grim", "Swift"], ["Wolf", "Fang"])
# 'Swift Fang'   — or any of the four combinations

generate_party(["Grim"], ["Wolf"], 3)
# ['Grim Wolf', 'Grim Wolf', 'Grim Wolf']

generate_party(["Grim"], ["Wolf"], 0)
# []
```

## Your objective

**`generate_name(adjectives, nouns)`** — pick one at random from each list and
return them joined by a single space.

**`generate_party(adjectives, nouns, size)`** — return a list of `size` names.
Repeats are fine; a party of nothing is an empty list.

## Watch out for

Build the second working **out of the first**. Calling `generate_name` inside
`generate_party` is not laziness — it is the entire habit this module is trying
to give you. If the naming rule ever changes, it should change in one place.
