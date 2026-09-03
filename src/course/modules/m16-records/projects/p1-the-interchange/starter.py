import json


def save_state(path, state):
    # your code here
    pass


def load_state(path):
    # your code here
    pass


if __name__ == "__main__":
    save_state("/workspace/save.json", {"room": "clearing", "moves": 3})
    print(load_state("/workspace/save.json"))
