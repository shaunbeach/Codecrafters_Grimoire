Five steps in order, and you already have the first and the last. Write them as
five separate lines before you try to shorten anything.
---
`scores.sort(key=lambda entry: entry[1], reverse=True)` orders by points,
highest first.

`scores[:5]` keeps the top five — and a slice is happy with a list shorter than
five, so no length check is needed.

Then save, then return.
---
```python
scores = load_scores(path)
scores.append((name, points))
scores.sort(key=lambda entry: entry[1], reverse=True)
scores = scores[:5]
save_scores(path, scores)
return scores
```
