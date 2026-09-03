def load_habits(path):
    # your code here
    pass


def save_habits(path, habits):
    # your code here
    pass


if __name__ == "__main__":
    save_habits("/workspace/habits.txt", {"reading": 12, "art": 3})
    print(load_habits("/workspace/habits.txt"))
