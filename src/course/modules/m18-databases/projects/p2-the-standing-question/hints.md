One query each. Write them in your head as English first — "sum the reward,
grouped by whether it is done" — and the SQL follows almost word for word.
---
```sql
SELECT done, SUM(reward) FROM quests GROUP BY done
```

gives you rows like `(0, 920)` and `(1, 355)`. Map `0` to `'open'` and `1` to
`'done'`, and fill in any status that did not come back with `0`.

For the second: `WHERE done = 0 ORDER BY reward DESC, title ASC LIMIT ?`.
---
```python
def reward_by_status(path):
    connection = sqlite3.connect(path)
    try:
        rows = connection.execute(
            "SELECT done, SUM(reward) FROM quests GROUP BY done"
        ).fetchall()
    finally:
        connection.close()

    totals = {"open": 0, "done": 0}
    for done, total in rows:
        totals["done" if done else "open"] = total or 0
    return totals
```
