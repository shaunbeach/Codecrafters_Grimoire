import random


def pick_secret(low, high):
    return random.randint(low, high)


def play_round(secret, guesses):
    hints = []
    i = 0
    while i < len(guesses):
        guess = guesses[i]
        if guess < secret:
            hints.append("too low")
        elif guess > secret:
            hints.append("too high")
        else:
            hints.append("correct")
            break
        i += 1

    if "correct" not in hints:
        hints.append("out of guesses")
    return hints
