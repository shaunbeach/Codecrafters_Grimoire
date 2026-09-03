def ward_strength(phrase):
    if len(phrase) < 12:
        return "too short"
    if not any(c.isupper() for c in phrase):
        return "needs a capital"
    if not any(c.islower() for c in phrase):
        return "needs a lowercase letter"
    if not any(c.isdigit() for c in phrase):
        return "needs a digit"
    return "ACCEPTED"
