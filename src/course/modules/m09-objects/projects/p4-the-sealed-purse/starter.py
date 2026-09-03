class Purse:
    def __init__(self, balance=0):
        # your code here
        pass


if __name__ == "__main__":
    purse = Purse(50)
    print(purse.add(25), purse.spend(30), len(purse))
    print(purse)
