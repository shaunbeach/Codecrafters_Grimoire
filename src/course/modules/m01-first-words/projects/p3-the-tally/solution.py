def split_bill(total, tip_percent, people):
    tip = total * tip_percent / 100
    grand_total = total + tip
    share = grand_total / people
    line_one = f"Bill: ${total:.2f} + {tip_percent}% tip (${tip:.2f}) = ${grand_total:.2f}"
    line_two = f"Split {people} ways: ${share:.2f} each"
    return line_one + "\n" + line_two
