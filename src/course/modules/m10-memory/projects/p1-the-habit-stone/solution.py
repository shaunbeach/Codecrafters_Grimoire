def load_habits(path):
    try:
        with open(path) as handle:
            text = handle.read()
    except FileNotFoundError:
        return {}

    habits = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        name, _, count = line.partition(":")
        count = count.strip()
        if not count.lstrip("-").isdigit():
            continue
        habits[name.strip()] = int(count)
    return habits


def save_habits(path, habits):
    with open(path, "w") as handle:
        for name in sorted(habits):
            handle.write(f"{name}:{habits[name]}\n")
