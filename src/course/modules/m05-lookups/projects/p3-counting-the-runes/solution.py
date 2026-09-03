def count_runes(text):
    counts = {}
    for character in text:
        if not character.isalpha():
            continue
        letter = character.lower()
        counts[letter] = counts.get(letter, 0) + 1
    return counts
