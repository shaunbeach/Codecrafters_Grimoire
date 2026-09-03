# A quest board with some history on it.
import os, sqlite3

os.makedirs("/workspace", exist_ok=True)
DB = "/workspace/board.db"

ROWS = [
    ("Slay the dragon", 500, 0),
    ("Deliver a letter", 50, 1),
    ("Clear the cellar", 120, 0),
    ("Feed the cat", 5, 1),
    ("Escort the caravan", 300, 0),
    ("Find the ring", 300, 1),
]


def reset_board():
    if os.path.exists(DB):
        os.remove(DB)
    connection = sqlite3.connect(DB)
    connection.execute(
        "CREATE TABLE quests (id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "title TEXT NOT NULL, reward INTEGER NOT NULL, done INTEGER NOT NULL)"
    )
    connection.executemany(
        "INSERT INTO quests (title, reward, done) VALUES (?, ?, ?)", ROWS
    )
    connection.commit()
    connection.close()


reset_board()
