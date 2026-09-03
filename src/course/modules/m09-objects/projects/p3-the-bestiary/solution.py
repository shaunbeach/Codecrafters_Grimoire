class Goblin(Enemy):
    def __init__(self):
        super().__init__("Goblin", 20, 4)

    def describe(self):
        return super().describe() + " — small and vicious"


class Dragon(Enemy):
    def __init__(self):
        super().__init__("Dragon", 200, 30)

    def describe(self):
        return super().describe() + " — it breathes fire"

    def attack(self):
        return super().attack() * 2


class Slime(Enemy):
    def __init__(self):
        super().__init__("Slime", 10, 2)

    def take_damage(self, amount):
        return super().take_damage(amount // 2)
