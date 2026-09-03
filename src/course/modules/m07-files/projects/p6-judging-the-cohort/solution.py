def class_average(rows, column):
    if not rows:
        return 0.0
    scores = [int(row[column]) for row in rows]
    return round(sum(scores) / len(scores), 2)


def top_student(rows):
    best_name = None
    best_average = None
    for row in rows:
        scores = [int(value) for key, value in row.items() if key != "name"]
        average = sum(scores) / len(scores)
        if best_average is None or average > best_average:
            best_average = average
            best_name = row["name"]
    return best_name

