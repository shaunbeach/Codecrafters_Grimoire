def adventure(choices):
    if len(choices) < 2:
        return "LOST"

    first = choices[0]
    second = choices[1]

    if first == "left":
        if second == "fight":
            return "VICTORY"
        elif second == "flee":
            return "SAFE_HOME"
        else:
            return "LOST"
    elif first == "right":
        if second == "knock":
            return "TREASURE"
        elif second == "open":
            return "GOBLIN_FEAST"
        else:
            return "LOST"
    else:
        return "LOST"
