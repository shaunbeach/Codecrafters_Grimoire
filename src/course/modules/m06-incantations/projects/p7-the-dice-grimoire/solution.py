import dice


def roll_stats(count, sides):
    """Roll count dice and summarise the results."""
    rolls = dice.roll_many(count, sides)
    return {
        "rolls": rolls,
        "total": sum(rolls),
        "highest": max(rolls),
        "lowest": min(rolls),
    }


def best_of(count, sides):
    """Roll count dice, drop the lowest, and sum the rest."""
    rolls = dice.roll_many(count, sides)
    if len(rolls) <= 1:
        return sum(rolls)
    return sum(rolls) - min(rolls)
