def tally(numbers):
    total = 0
    for number in numbers:
        if number == 0:
            break
        if number == 13:
            continue
        total += number
    return total
