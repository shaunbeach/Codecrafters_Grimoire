ALPHABET_START = ord("a")


def build_cipher(shift):
    cipher = {}
    for i in range(26):
        plain = chr(ALPHABET_START + i)
        coded = chr(ALPHABET_START + (i + shift) % 26)
        cipher[plain] = coded
    return cipher


def encode(text, shift):
    cipher = build_cipher(shift)
    return "".join(cipher.get(letter, letter) for letter in text)


def decode(text, shift):
    return encode(text, -shift)
