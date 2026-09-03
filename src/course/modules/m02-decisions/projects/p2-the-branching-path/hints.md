Sketch the tree on paper before you write anything. Four leaves means four
`return` statements, and every path through your code must reach one of them.
---
Deal with a short list first — `if len(choices) < 2: return "LOST"` — and after
that you can read both choices safely.

Then it is one `if` on the first choice, with another `if` inside each branch.
Every branch needs its own "anything else" case, because an unrecognised second
choice is just as lost as an unrecognised first one.
---
```python
if len(choices) < 2:
    return "LOST"

first, second = choices[0], choices[1]

if first == "left":
    if second == "fight":
        return "VICTORY"
    elif second == "flee":
        return "SAFE_HOME"
    else:
        return "LOST"
elif first == "right":
    ...
```
