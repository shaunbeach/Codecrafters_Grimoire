# Enemy, from the working before this one. Yours to inherit from.
class Enemy:
    """Anything that can be fought."""

    def __init__(self, name, health, damage):
        self.name = name
        self.health = health
        self.damage = damage

    def describe(self):
        return f"{self.name} ({self.health} HP)"

    def attack(self):
        return self.damage

    def take_damage(self, amount):
        self.health = max(0, self.health - amount)
        return self.health

    def is_alive(self):
        return self.health > 0
