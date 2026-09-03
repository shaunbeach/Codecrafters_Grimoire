def ward_strength(phrase):
    # your code here
    pass


if __name__ == "__main__":
    for phrase in ("Th1s is str0ng", "short1A", "NoDigitsInHere"):
        print(f"{phrase!r:24} {ward_strength(phrase)}")
