import sqlite3

DB = "/workspace/board.db"


def test_totals_by_status():
    """Open and done rewards are summed separately"""
    reward_by_status = require("reward_by_status")
    reset_board()
    result = reward_by_status(DB)
    assert result == {"open": 920, "done": 355}, f"Got {result}"


def test_both_keys_always_present():
    """A status with no quests still reports zero"""
    reward_by_status = require("reward_by_status")
    reset_board()
    connection = sqlite3.connect(DB)
    connection.execute("DELETE FROM quests WHERE done = 1")
    connection.commit()
    connection.close()
    assert reward_by_status(DB) == {"open": 920, "done": 0}, (
        f"Got {reward_by_status(DB)}. A group with no rows does not come back from "
        "the query — fill the missing key in afterwards."
    )


def test_richest_open_quests():
    """The most valuable unfinished quests, in order"""
    richest = require("richest")
    reset_board()
    assert richest(DB, 2) == [("Slay the dragon", 500), ("Escort the caravan", 300)], (
        f"Got {richest(DB, 2)}"
    )


def test_finished_quests_excluded():
    """'Find the ring' is done, and pays 300"""
    richest = require("richest")
    reset_board()
    titles = [title for title, _reward in richest(DB, 10)]
    assert "Find the ring" not in titles, (
        f"Got {titles}. Only unfinished quests — WHERE done = 0."
    )
    assert len(titles) == 3, f"There are three open quests; got {len(titles)}."


def test_the_limit_is_respected():
    """It returns at most what was asked for"""
    richest = require("richest")
    reset_board()
    assert len(richest(DB, 1)) == 1, f"Got {len(richest(DB, 1))} rows for a limit of 1."
    assert len(richest(DB, 99)) == 3, "A limit larger than the table is not an error."


def test_ties_break_alphabetically():
    """Equal rewards are ordered by title"""
    richest = require("richest")
    reset_board()
    connection = sqlite3.connect(DB)
    connection.execute("INSERT INTO quests (title, reward, done) VALUES ('Ambush', 500, 0)")
    connection.commit()
    connection.close()
    assert richest(DB, 2) == [("Ambush", 500), ("Slay the dragon", 500)], (
        f"Got {richest(DB, 2)}. Add a second ORDER BY column."
    )
