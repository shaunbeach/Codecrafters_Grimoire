def _count(path):
    try:
        with open(path) as handle:
            return len([line for line in handle if line.strip()])
    except FileNotFoundError:
        return 0


def record(path, entry):
    if not entry.strip():
        return _count(path)

    with open(path, "a") as handle:
        handle.write(f"- {entry}\n")

    return _count(path)
