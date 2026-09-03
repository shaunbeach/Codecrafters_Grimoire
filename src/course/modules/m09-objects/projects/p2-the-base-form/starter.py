class Enemy:
    def __init__(self, name, health, damage):
        # your code here
        pass


if __name__ == "__main__":
    rat = Enemy("Rat", 5, 1)
    print(rat.describe(), rat.attack(), rat.is_alive())
