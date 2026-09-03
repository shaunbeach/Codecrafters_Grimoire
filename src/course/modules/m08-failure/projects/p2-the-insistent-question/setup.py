# safe_int, from the working before this one. Yours to build on.
def safe_int(text, default=0):
    try:
        return int(text)
    except (ValueError, TypeError):
        return default
