## The situation

You wake in a stone hall with two doors and no memory of arriving. What happens
next depends on you — twice.

This is where a program stops being a list of rules and becomes a shape.

## What good looks like

```
                  You wake in a stone hall
                    /                  \
              "left"                   "right"
          a goblin blocks it       a locked door
           /          \             /          \
      "fight"      "flee"       "knock"      "open"
     'VICTORY'   'SAFE_HOME'   'TREASURE'  'GOBLIN_FEAST'
```

```python
adventure(["left", "fight"])      # 'VICTORY'
adventure(["right", "open"])      # 'GOBLIN_FEAST'
adventure(["up"])                 # 'LOST'
adventure(["left"])               # 'LOST'
```

## Your objective

**`adventure(choices)`** — walk the story and return the ending.

- `choices` is a list of lowercase strings, read in order
- any unrecognised choice, or a list that runs out too early, returns `'LOST'`
- extra choices beyond what the story needs are ignored

## Watch out for

`choices[1]` on a one-item list raises `IndexError`. Check the length before you
reach for the second choice — a story that crashes is not an ending.

The choices are exact and lowercase. `"LEFT"` is not `"left"`, and here that is
deliberate: you are being asked to notice.
