Build the "who" part first — either `title + " " + name` or just `name` — and
give it a name of its own. Then wrap it in the sentence once.
---
For the shouting, do it to the finished sentence rather than to each piece:
`.upper()` then `.replace(".", "!")`.

For `shout_all`, a loop or a comprehension calling `greet(name, excited=True)`.
Naming the argument is what lets you skip the title.
---
```python
def greet(name, title="", excited=False):
    who = f"{title} {name}" if title else name
    message = f"Hello, {who}."
    if excited:
        message = message.upper().replace(".", "!")
    return message


def shout_all(names):
    return [greet(name, excited=True) for name in names]
```
