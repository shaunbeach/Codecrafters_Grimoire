from world_data import ROOMS


class World:
    """Answers questions about the map."""

    def __init__(self, rooms):
        self.rooms = rooms

    def describe(self, room):
        return self.rooms[room]["description"]

    def exits(self, room):
        return sorted(self.rooms[room]["exits"])

    def destination(self, room, direction):
        return self.rooms[room]["exits"].get(direction)

    def items(self, room):
        return self.rooms[room]["items"]


class Player:
    """Where you are and what you are carrying."""

    def __init__(self, world, start):
        self.world = world
        self.room = start
        self.inventory = []
        self.moves = 0

    def look(self):
        lines = [self.world.describe(self.room)]
        lines.append("Exits: " + ", ".join(self.world.exits(self.room)))
        items = sorted(self.world.items(self.room))
        if items:
            lines.append("You can see: " + ", ".join(items))
        return "\n".join(lines)

    def move(self, direction):
        destination = self.world.destination(self.room, direction)
        if destination is None:
            return "You cannot go that way."
        self.room = destination
        self.moves += 1
        return f"You go {direction}."

    def take(self, item):
        items = self.world.items(self.room)
        if item not in items:
            return f"There is no {item} here."
        items.remove(item)
        self.inventory.append(item)
        return f"You take the {item}."

    def inventory_list(self):
        return sorted(self.inventory)
