Build the table first and print it. If `cipher['a']` is `'d'` and `cipher['z']`
is `'c'`, the hard part is already done and the rest is lookups.
---
For the table: loop `for i in range(26)`, and the shifted letter is
`chr(97 + (i + shift) % 26)`.

For encoding: `"".join(...)` over every character, looking each one up with
`cipher.get(ch, ch)` so anything not in the table passes through.

For decoding: shifting back by `shift` is the same as shifting forward by
`-shift`.
---
```python
def build_cipher(shift):
    cipher = {}
    for i in range(26):
        cipher[chr(97 + i)] = chr(97 + (i + shift) % 26)
    return cipher


def encode(text, shift):
    cipher = build_cipher(shift)
    return "".join(cipher.get(letter, letter) for letter in text)


def decode(text, shift):
    return encode(text, -shift)
```
