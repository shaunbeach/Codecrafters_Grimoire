Four workings, each the same shape: connect, get a cursor, run a statement,
commit if you changed anything, close.
---
`CREATE TABLE IF NOT EXISTS` is what makes the second run safe.

For the insert, `cursor.lastrowid` after `execute` gives you the new id.

For the completion, `cursor.rowcount > 0` after the `UPDATE`.

For the query, `ORDER BY reward DESC, title ASC` does both sorts in one clause.
---
```python
def add_quest(path, title, reward):
    connection = sqlite3.connect(path)
    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO quests (title, reward, done) VALUES (?, ?, 0)",
            (title, reward),
        )
        connection.commit()
        return cursor.lastrowid
    finally:
        connection.close()
```
