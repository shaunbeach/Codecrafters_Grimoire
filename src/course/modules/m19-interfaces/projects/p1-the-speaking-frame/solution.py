import textwrap

FAREWELLS = {"bye", "goodbye", "quit"}
GREETINGS = {"hello", "hi", "hey"}


def render_panel(text, title="", width=40):
    border = "+" + "-" * (width - 2) + "+"

    def row(content):
        return "| " + content.ljust(width - 4) + " |"

    lines = [border]
    if title:
        lines.append(row(title))
        lines.append(border)
    for line in textwrap.wrap(text, width - 4) or [""]:
        lines.append(row(line))
    lines.append(border)
    return "\n".join(lines)


def _words(message):
    return {word.strip(".,!?;:'\"").lower() for word in message.split()}


def reply_to(message):
    if not message.strip():
        return "Say something!"

    words = _words(message)
    if words & FAREWELLS:
        return "Goodbye!"
    if words & GREETINGS:
        return "Hello there!"
    if message.strip().endswith("?"):
        return "That is a good question."
    return "Tell me more."


def chat():
    replies = []
    while True:
        try:
            message = input("> ")
        except EOFError:
            return replies

        reply = reply_to(message)
        replies.append(reply)
        print(render_panel(reply, title="PythonBot"))
        if reply == "Goodbye!":
            return replies
