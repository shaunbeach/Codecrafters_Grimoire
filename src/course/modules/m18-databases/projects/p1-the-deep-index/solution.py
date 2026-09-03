import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS quests (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    title  TEXT NOT NULL,
    reward INTEGER NOT NULL DEFAULT 0,
    done   INTEGER NOT NULL DEFAULT 0
)
"""


def create_db(path):
    connection = sqlite3.connect(path)
    try:
        connection.execute(SCHEMA)
        connection.commit()
    finally:
        connection.close()


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


def complete_quest(path, quest_id):
    connection = sqlite3.connect(path)
    try:
        cursor = connection.cursor()
        cursor.execute("UPDATE quests SET done = 1 WHERE id = ?", (quest_id,))
        connection.commit()
        return cursor.rowcount > 0
    finally:
        connection.close()


def open_quests(path):
    connection = sqlite3.connect(path)
    try:
        cursor = connection.cursor()
        cursor.execute(
            "SELECT id, title, reward FROM quests WHERE done = 0 "
            "ORDER BY reward DESC, title ASC"
        )
        return cursor.fetchall()
    finally:
        connection.close()
