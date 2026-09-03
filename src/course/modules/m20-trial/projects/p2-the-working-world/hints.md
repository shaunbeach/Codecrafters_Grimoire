`World` is four one-line methods that each look something up in `self.rooms`.
Write it and check it on its own before you start the player.
---
`Player.__init__` stores the world, the starting room **name** (a string, not the
dict), an empty inventory and a move count of zero.

`look()` builds a list of lines and joins it at the end. The items line is
appended only `if items`, which is much clearer than trying to build the whole
string in one expression.

`move` asks the world first, returns early if the answer is `None`, and only
then changes anything.
---
```python
def look(self):
    lines = [self.world.describe(self.room)]
    lines.append("Exits: " + ", ".join(self.world.exits(self.room)))
    items = sorted(self.world.items(self.room))
    if items:
        lines.append("You can see: " + ", ".join(items))
    return "\n".join(lines)


def take(self, item):
    items = self.world.items(self.room)
    if item not in items:
        return f"There is no {item} here."
    items.remove(item)
    self.inventory.append(item)
    return f"You take the {item}."
```
