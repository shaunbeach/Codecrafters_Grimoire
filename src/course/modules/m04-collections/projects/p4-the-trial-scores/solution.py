def judge(scores):
    if len(scores) < 2:
        return 0.0

    rest = sorted(scores)[1:]
    return round(sum(rest) / len(rest), 2)
