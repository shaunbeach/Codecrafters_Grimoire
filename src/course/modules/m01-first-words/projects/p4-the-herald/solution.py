def announce(name):
    if not name:
        return "Make way for a stranger with no name."
    return f"Make way for {name.upper()}, whose name is {len(name)} letters long."
