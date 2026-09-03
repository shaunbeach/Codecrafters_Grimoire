## The situation

Now the part a list cannot do.

"How much reward is outstanding, and how much has been paid?" is one query. In
Python it is a loop, two accumulators and a bug waiting to happen — and on four
million rows it is a minute of waiting.

Let the database answer.

## What good looks like

The board holds six quests, three done and three not:

```python
reward_by_status("/workspace/board.db")
# {'open': 920, 'done': 355}

richest("/workspace/board.db", 2)
# [('Slay the dragon', 500), ('Escort the caravan', 300)]
```

## Your objective

**`reward_by_status(path)`** — return `{'open': total, 'done': total}`, the sum
of rewards for unfinished and finished quests. Use a single query with
`GROUP BY`; do not add them up in Python.

**`richest(path, limit)`** — return `(title, reward)` for the highest-rewarded
**unfinished** quests, most valuable first, ties broken alphabetically by title,
at most `limit` of them.

## Watch out for

`SUM(reward)` and `GROUP BY done` do the whole of the first working in one
statement. That is the point of the drill — the database is not just storage,
it is a calculator that lives next to the data.

A status with no quests should still appear in the dict, as `0`. Add the missing
key afterwards rather than assuming the group came back.

`LIMIT` goes at the end, after `ORDER BY`. Reversing them is a syntax error, and
limiting before ordering would give you the wrong rows anyway.
