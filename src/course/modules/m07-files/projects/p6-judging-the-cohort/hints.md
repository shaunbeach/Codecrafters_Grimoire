Two separate workings. Do the average first; it is four lines and the second one
reuses the idea.
---
For the average: guard the empty list, then
`[int(row[column]) for row in rows]` and divide the sum by the length.

For the top student: for each row, average every value whose **key is not
`'name'`**. `row.items()` gives you key and value together, which is what lets
you filter on the key.

Keep track of the best as you go, or build a list of `(average, name)` pairs and
take the largest.
---
```python
def class_average(rows, column):
    if not rows:
        return 0.0
    scores = [int(row[column]) for row in rows]
    return round(sum(scores) / len(scores), 2)


def top_student(rows):
    best_name = None
    best_average = None
    for row in rows:
        scores = [int(v) for k, v in row.items() if k != "name"]
        average = sum(scores) / len(scores)
        if best_average is None or average > best_average:
            best_average, best_name = average, row["name"]
    return best_name
```
