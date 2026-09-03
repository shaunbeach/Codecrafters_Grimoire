def safe_int(text, default=0):
    try:
        return int(text)
    except (ValueError, TypeError):
        return default


def average(numbers):
    try:
        return sum(numbers) / len(numbers)
    except ZeroDivisionError:
        return 0.0
