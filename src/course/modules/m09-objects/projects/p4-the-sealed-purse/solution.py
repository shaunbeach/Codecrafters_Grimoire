class Purse:
    def __init__(self, balance=0):
        if balance < 0:
            raise ValueError(f"a purse cannot start with {balance}")
        self.balance = balance

    def add(self, amount):
        if amount < 0:
            raise ValueError(f"cannot add a negative amount: {amount}")
        self.balance += amount
        return self.balance

    def spend(self, amount):
        if amount < 0:
            raise ValueError(f"cannot spend a negative amount: {amount}")
        if amount > self.balance:
            raise ValueError(f"cannot spend {amount} from {self.balance}")
        self.balance -= amount
        return self.balance

    def __len__(self):
        return self.balance

    def __str__(self):
        return f"a purse of {self.balance} coins"
