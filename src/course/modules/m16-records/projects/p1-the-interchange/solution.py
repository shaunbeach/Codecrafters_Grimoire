import json


def save_state(path, state):
    with open(path, "w") as handle:
        json.dump(state, handle, indent=2, sort_keys=True)


def load_state(path):
    try:
        with open(path) as handle:
            data = json.load(handle)
    except (FileNotFoundError, ValueError):
        return {}

    if not isinstance(data, dict):
        return {}
    return data
