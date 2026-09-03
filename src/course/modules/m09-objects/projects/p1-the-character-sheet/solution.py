class Character:
    """One adventurer, monster or shopkeeper."""

    def __init__(self, name, health=100, strength=10):
        self.name = name
        self.health = health
        self.max_health = health
        self.strength = strength

    def is_alive(self):
        return self.health > 0

    def take_damage(self, amount):
        self.health = max(0, self.health - amount)
        return self.health

    def heal(self, amount):
        if not self.is_alive():
            return self.health
        self.health = min(self.max_health, self.health + amount)
        return self.health

    def attack(self, other):
        if not self.is_alive():
            return 0
        other.take_damage(self.strength)
        return self.strength

    def __str__(self):
        return f"{self.name}: {self.health}/{self.max_health} HP"
