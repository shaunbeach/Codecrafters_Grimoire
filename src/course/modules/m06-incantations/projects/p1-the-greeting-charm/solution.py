def greet(name, title="", excited=False):
    """Return a greeting, optionally with a title and plenty of enthusiasm."""
    who = f"{title} {name}" if title else name
    message = f"Hello, {who}."
    if excited:
        message = message.upper().replace(".", "!")
    return message


def shout_all(names):
    """Greet everyone in names, excitedly."""
    return [greet(name, excited=True) for name in names]
