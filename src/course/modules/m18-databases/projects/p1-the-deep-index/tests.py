import os
import sqlite3

SCRATCH = "/tmp/day26"
_counter = [0]


def _fresh():
    os.makedirs(SCRATCH, exist_ok=True)
    _counter[0] += 1
    path = os.path.join(SCRATCH, f"quests{_counter[0]}.db")
    if os.path.exists(path):
        os.remove(path)
    return path


def test_create_makes_the_table():
    """create_db creates a quests table with the right columns"""
    create_db = require("create_db")
    path = _fresh()
    create_db(path)
    assert os.path.exists(path), "No database file was created at that path."
    with sqlite3.connect(path) as connection:
        columns = {row[1] for row in connection.execute("PRAGMA table_info(quests)")}
    assert columns == {"id", "title", "reward", "done"}, (
        f"The quests table has the columns {sorted(columns)}; "
        "expected id, title, reward and done."
    )


def test_create_is_idempotent():
    """Running create_db twice is safe"""
    create_db = require("create_db")
    path = _fresh()
    create_db(path)
    try:
        create_db(path)
    except sqlite3.OperationalError as exc:
        raise AssertionError(
            f"The second create_db raised {exc}. Use CREATE TABLE IF NOT EXISTS."
        )


def test_add_returns_ids():
    """add_quest returns the new row's id"""
    create_db = require("create_db")
    add_quest = require("add_quest")
    path = _fresh()
    create_db(path)
    first = add_quest(path, "Slay the dragon", 500)
    second = add_quest(path, "Feed the cat", 5)
    assert isinstance(first, int), f"Expected an int id, got {first!r}."
    assert second == first + 1, (
        f"Ids should count up ({first} then {second}). Return cursor.lastrowid."
    )


def test_add_commits():
    """Added quests survive the connection closing"""
    create_db = require("create_db")
    add_quest = require("add_quest")
    path = _fresh()
    create_db(path)
    add_quest(path, "Slay the dragon", 500)
    with sqlite3.connect(path) as connection:
        rows = connection.execute("SELECT title, reward, done FROM quests").fetchall()
    assert rows == [("Slay the dragon", 500, 0)], (
        f"The database holds {rows}. Did you call connection.commit()? "
        "New quests start with done = 0."
    )


def test_open_quests():
    """open_quests returns unfinished quests, richest first"""
    create_db = require("create_db")
    add_quest = require("add_quest")
    open_quests = require("open_quests")
    path = _fresh()
    create_db(path)
    add_quest(path, "Feed the cat", 5)
    add_quest(path, "Slay the dragon", 500)
    add_quest(path, "Deliver a letter", 50)
    result = open_quests(path)
    assert [row[1] for row in result] == ["Slay the dragon", "Deliver a letter", "Feed the cat"], (
        f"Got {result}. Order by reward DESC."
    )
    assert result[0] == (2, "Slay the dragon", 500), (
        f"Each row should be (id, title, reward); got {result[0]}"
    )


def test_ties_break_alphabetically():
    """Equal rewards are ordered by title"""
    create_db = require("create_db")
    add_quest = require("add_quest")
    open_quests = require("open_quests")
    path = _fresh()
    create_db(path)
    add_quest(path, "Zebra hunt", 10)
    add_quest(path, "Apple picking", 10)
    assert [row[1] for row in open_quests(path)] == ["Apple picking", "Zebra hunt"], (
        f"Got {open_quests(path)}. Add a second ORDER BY column."
    )


def test_complete_quest():
    """Completing a quest removes it from the open list"""
    create_db = require("create_db")
    add_quest = require("add_quest")
    complete_quest = require("complete_quest")
    open_quests = require("open_quests")
    path = _fresh()
    create_db(path)
    dragon = add_quest(path, "Slay the dragon", 500)
    cat = add_quest(path, "Feed the cat", 5)
    assert complete_quest(path, cat) is True, "Completing a real quest should return True."
    remaining = open_quests(path)
    assert [row[0] for row in remaining] == [dragon], f"Got {remaining}"


def test_complete_missing_quest():
    """Completing an id that does not exist returns False"""
    create_db = require("create_db")
    complete_quest = require("complete_quest")
    path = _fresh()
    create_db(path)
    assert complete_quest(path, 999) is False, (
        "There is no quest 999, so this should return False. cursor.rowcount "
        "tells you how many rows actually changed."
    )


def test_no_sql_injection():
    """Values are passed as parameters, not pasted into the SQL"""
    create_db = require("create_db")
    add_quest = require("add_quest")
    open_quests = require("open_quests")
    path = _fresh()
    create_db(path)
    nasty = "Bobby'); DROP TABLE quests; --"
    add_quest(path, nasty, 1)
    try:
        rows = open_quests(path)
    except sqlite3.OperationalError as exc:
        raise AssertionError(
            f"The quests table did not survive a hostile title ({exc}). "
            "Use ? placeholders instead of building the SQL with an f-string."
        )
    assert [row[1] for row in rows] == [nasty], (
        f"The title should be stored verbatim. Got {rows}"
    )
