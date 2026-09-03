## The situation

The quest board has outgrown a text file. There are four thousand quests, people
want them sorted by reward, and half of them are finished.

Put them somewhere that can answer questions.

## What good looks like

```python
create_db("/workspace/q.db")
add_quest("/workspace/q.db", "Slay the dragon", 500)     # 1
add_quest("/workspace/q.db", "Feed the cat", 5)          # 2
complete_quest("/workspace/q.db", 2)                     # True
open_quests("/workspace/q.db")
# [(1, 'Slay the dragon', 500)]
```

## Your objective

**`create_db(path)`** — create a `quests` table with `id`, `title`, `reward` and
`done`. Running it twice must not raise.

**`add_quest(path, title, reward)`** — insert an unfinished quest and return its
new `id`.

**`complete_quest(path, quest_id)`** — set `done` to 1. Return `True` if a row
changed, `False` if that id does not exist.

**`open_quests(path)`** — `(id, title, reward)` tuples for unfinished quests,
highest reward first, ties broken alphabetically by title.

## Watch out for

Use `?` placeholders for every value. Never build the SQL with an f-string — a
quest titled `'); DROP TABLE quests; --` would otherwise be executed, and one of
the checks tries exactly that.

`commit()` or your changes never leave the transaction. A working that inserts
and does not commit passes every test that looks at the same connection and
fails the moment anyone opens the file fresh.

`cursor.rowcount` is what tells you whether the update found anything.
