# save_scores and load_scores, from the working before this one.

def save_scores(path, scores):
    with open(path, "w") as handle:
        for name, points in scores:
            handle.write(f"{name},{points}\n")


def load_scores(path):
    try:
        with open(path) as handle:
            text = handle.read()
    except FileNotFoundError:
        return []

    scores = []
    for line in text.splitlines():
        if not line.strip():
            continue
        name, points = line.split(",")
        scores.append((name, int(points)))
    return scores
