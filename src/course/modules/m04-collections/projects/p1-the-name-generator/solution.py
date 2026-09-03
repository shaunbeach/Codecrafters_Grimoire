import random


def generate_name(adjectives, nouns):
    adjective = random.choice(adjectives)
    noun = random.choice(nouns)
    return f"{adjective} {noun}"


def generate_party(adjectives, nouns, size):
    party = []
    for _ in range(size):
        party.append(generate_name(adjectives, nouns))
    return party
