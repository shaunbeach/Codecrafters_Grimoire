def _is_integer(text):
    return text.lstrip("-").isdigit()


def run_command(store, line):
    parts = line.split()
    if not parts:
        return "bad arguments"

    verb = parts[0]
    arguments = parts[1:]

    if verb == "list":
        if arguments:
            return "bad arguments"
        if not store:
            return "(empty)"
        return ", ".join(sorted(store))

    if verb in ("set", "add"):
        if len(arguments) != 2 or not _is_integer(arguments[1]):
            return "bad arguments"
        name, value = arguments[0], int(arguments[1])
        if verb == "add":
            value += store.get(name, 0)
        store[name] = value
        return f"{name} = {store[name]}"

    if verb in ("get", "del"):
        if len(arguments) != 1:
            return "bad arguments"
        name = arguments[0]
        if name not in store:
            return f"no such key: {name}"
        if verb == "get":
            return f"{name} = {store[name]}"
        del store[name]
        return f"deleted {name}"

    return f"unknown command: {verb}"
