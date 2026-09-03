# Enemy is already here, from the previous working.


class Goblin(Enemy):
    pass


class Dragon(Enemy):
    pass


class Slime(Enemy):
    pass


if __name__ == "__main__":
    for monster in (Goblin(), Dragon(), Slime()):
        print(monster.describe(), "->", monster.attack())
