def add_score(path, name, points):
    scores = load_scores(path)
    scores.append((name, points))
    scores.sort(key=lambda entry: entry[1], reverse=True)
    scores = scores[:5]
    save_scores(path, scores)
    return scores

