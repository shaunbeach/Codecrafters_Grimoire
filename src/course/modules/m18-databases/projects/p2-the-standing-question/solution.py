import sqlite3


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


def richest(path, limit):
    connection = sqlite3.connect(path)
    try:
        return connection.execute(
            "SELECT title, reward FROM quests WHERE done = 0 "
            "ORDER BY reward DESC, title ASC LIMIT ?",
            (limit,),
        ).fetchall()
    finally:
        connection.close()
