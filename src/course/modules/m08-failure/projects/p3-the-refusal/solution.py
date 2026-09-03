def carriage_cost(weight):
    if isinstance(weight, bool) or not isinstance(weight, (int, float)):
        raise TypeError(f"weight must be a number, got {type(weight).__name__}")
    if weight <= 0:
        raise ValueError(f"weight must be above zero, got {weight}")

    stones = int(weight)
    if stones <= 1:
        return 5.0
    return 5.0 + 2.0 * (stones - 1)
