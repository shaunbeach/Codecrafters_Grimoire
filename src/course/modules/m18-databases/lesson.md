# The Catacomb

A file holds things. A database *answers questions about* things — and it
answers the ones a list cannot, on data far larger than your machine's memory,
in the time it takes to ask.

"The ten highest-paying unfinished quests, ordered by reward" is one line here.
Try it with a list of dictionaries on four million rows and you will understand
why this exists.

## No server, no password, no install

```python
import sqlite3

connection = sqlite3.connect("quests.db")
```

The whole database is one file. Nothing to start, nothing to configure. Pass
`":memory:"` and it lives only in RAM, which is perfect for tests.

SQLite is not a toy. It is on your phone, in your browser and in an aeroplane
somewhere, and it is very probably the most widely deployed database in the
world.

## Connections and cursors

```python
connection = sqlite3.connect(path)
cursor = connection.cursor()
cursor.execute("SELECT 1")
cursor.fetchone()
connection.close()
```

The **connection** is the file. The **cursor** runs statements and holds
results.

## Making a table

```sql
CREATE TABLE IF NOT EXISTS quests (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    title  TEXT NOT NULL,
    reward INTEGER NOT NULL DEFAULT 0,
    done   INTEGER NOT NULL DEFAULT 0
)
```

- `INTEGER PRIMARY KEY AUTOINCREMENT` — SQLite fills it in and never reuses a
  number
- `NOT NULL` — the database itself refuses rows missing this
- `IF NOT EXISTS` — running your setup twice is not an error

SQLite has no boolean type; use `0` and `1`.

That `NOT NULL` is worth pausing on. It is a rule enforced by the *data*, not by
your code — so it holds even when somebody writes to the file with a different
programme, in a different language, next year.

## Inserting

```python
cursor.execute(
    "INSERT INTO quests (title, reward) VALUES (?, ?)",
    ("Slay the dragon", 500),
)
connection.commit()
new_id = cursor.lastrowid
```

Two things matter enormously here.

**The `?` placeholders.** Never build SQL with an f-string:

```python
cursor.execute(f"INSERT INTO quests (title) VALUES ('{title}')")   # NO
```

A title of `'); DROP TABLE quests; --` would then be executed as SQL. That is
**SQL injection**, the most-exploited bug class in the history of the web, and
the fix is not vigilance — it is the `?`, which sends the value separately from
the statement so it can never be read as code. It also handles quotes and
unicode for you.

**`commit()`.** Until you commit, your changes exist only inside your
transaction. Close without committing and they are gone. That is not a flaw; it
is what lets you make five related changes and have all or none of them happen.

## Asking

```python
cursor.execute(
    "SELECT id, title FROM quests WHERE done = ? ORDER BY reward DESC",
    (0,),
)
cursor.fetchone()      # the next row, as a tuple, or None
cursor.fetchall()      # every remaining row
```

Note `(0,)` — the trailing comma. `(0)` is just the number zero in brackets; the
comma is what makes it a tuple.

## Changing, and knowing whether it worked

```python
cursor.execute("UPDATE quests SET done = 1 WHERE id = ?", (quest_id,))
connection.commit()
cursor.rowcount        # how many rows actually changed — 0 if that id was gone
```

`rowcount` is how you tell "marked it done" from "there was nothing to mark",
and reporting the difference honestly is most of what makes a tool trustworthy.
