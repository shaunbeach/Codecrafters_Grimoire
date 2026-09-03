import json

REQUIRED_KEYS = {"room", "inventory", "moves"}

HELP = """Commands:
  look          describe where you are
  take <item>   pick something up
  inventory     list what you are carrying
  save          write your progress to disk
  help          show this message
  quit          leave the game"""


def new_state():
    return {"room": "clearing", "inventory": [], "moves": 0}


def save_game(path, state):
    with open(path, "w") as handle:
        json.dump(state, handle, indent=2)


def load_game(path):
    try:
        with open(path) as handle:
            state = json.load(handle)
    except (FileNotFoundError, ValueError):
        return new_state()

    if not isinstance(state, dict) or not REQUIRED_KEYS <= set(state):
        return new_state()
    return state


def play(path):
    state = load_game(path)

    while True:
        try:
            line = input("> ")
        except EOFError:
            return state

        parts = line.strip().split()
        if not parts:
            print("Say something, or type help.")
            continue

        command, arguments = parts[0].lower(), parts[1:]

        if command == "quit":
            print("Goodbye.")
            state["moves"] += 1
            return state

        if command == "look":
            print(f"You are in the {state['room']}.")
        elif command == "take":
            if not arguments:
                print("Take what?")
                continue
            item = arguments[0]
            state["inventory"].append(item)
            print(f"You take the {item}.")
        elif command == "inventory":
            carried = sorted(state["inventory"])
            if carried:
                print("You are carrying: " + ", ".join(carried))
            else:
                print("You are carrying nothing.")
        elif command == "save":
            save_game(path, state)
            print("Game saved.")
        elif command == "help":
            print(HELP)
        else:
            print(f"I do not understand '{command}'. Try help.")
            continue

        state["moves"] += 1
