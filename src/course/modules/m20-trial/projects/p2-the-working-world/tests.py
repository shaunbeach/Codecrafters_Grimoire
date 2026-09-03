def _player(start="clearing"):
    World = require("World", "class")
    Player = require("Player", "class")
    return Player(World(fresh_rooms()), start)


def test_world_questions():
    """World answers questions about the map"""
    World = require("World", "class")
    world = World(fresh_rooms())
    assert world.describe("cave") == "A damp cave. Something drips in the dark.", (
        f"Got {world.describe('cave')!r}"
    )
    assert world.exits("clearing") == ["east", "north"], (
        f"Got {world.exits('clearing')} — the directions should be sorted."
    )
    assert world.destination("clearing", "north") == "cave"
    assert world.destination("clearing", "west") is None, (
        "An impossible direction should give None, not raise."
    )


def test_world_items_are_live():
    """items() hands back the room's own list"""
    World = require("World", "class")
    rooms = fresh_rooms()
    world = World(rooms)
    world.items("clearing").remove("rope")
    assert rooms["clearing"]["items"] == [], (
        "Removing from the list items() returned did not change the room. "
        "Return the list itself rather than a copy."
    )


def test_player_starts_empty():
    """A new player carries nothing and has moved nowhere"""
    player = _player()
    assert player.room == "clearing", f"room is {player.room!r}"
    assert player.inventory == [], f"inventory is {player.inventory!r}"
    assert player.moves == 0, f"moves is {player.moves!r}"


def test_look():
    """look describes the room, its exits and its items"""
    player = _player()
    assert player.look() == (
        "A quiet clearing ringed by white birch trees.\n"
        "Exits: east, north\n"
        "You can see: rope"
    ), f"Got:\n{player.look()}"


def test_look_without_items():
    """An empty room has no 'You can see' line"""
    player = _player("cottage")
    assert player.look() == (
        "A tidy cottage with a cold hearth.\nExits: west"
    ), f"Got:\n{player.look()}"


def test_look_sorts_items():
    """Several items are listed alphabetically"""
    player = _player("cave")
    assert "You can see: coin, lantern" in player.look(), f"Got:\n{player.look()}"


def test_move():
    """Moving updates the room and counts the move"""
    player = _player()
    assert player.move("north") == "You go north.", f"Got {player.move('north')!r}"
    assert player.room == "cave", f"The player is in {player.room!r}"
    assert player.moves == 1, f"moves is {player.moves}"


def test_impossible_move():
    """A wall costs nothing"""
    player = _player()
    assert player.move("west") == "You cannot go that way.", f"Got {player.move('west')!r}"
    assert player.room == "clearing", f"The player moved anyway, to {player.room!r}."
    assert player.moves == 0, f"A failed move should not count; moves is {player.moves}."


def test_take():
    """Taking an item moves it from the room to the inventory"""
    player = _player()
    assert player.take("rope") == "You take the rope.", f"Got {player.take('rope')!r}"
    assert player.inventory == ["rope"], f"inventory is {player.inventory!r}"
    assert "You can see" not in player.look(), (
        f"The rope is still in the room:\n{player.look()}"
    )


def test_take_something_that_is_not_there():
    """You cannot take what is not there"""
    player = _player()
    assert player.take("sword") == "There is no sword here.", f"Got {player.take('sword')!r}"
    assert player.inventory == [], f"inventory is {player.inventory!r}"


def test_inventory_list_is_a_sorted_copy():
    """inventory_list sorts, and does not expose the real list"""
    player = _player("cave")
    player.take("lantern")
    player.take("coin")
    listed = player.inventory_list()
    assert listed == ["coin", "lantern"], f"Got {listed}"
    listed.append("crown")
    assert player.inventory_list() == ["coin", "lantern"], (
        "Changing the returned list changed the player's inventory — return a copy."
    )


def test_a_short_journey():
    """The whole thing works end to end"""
    player = _player()
    player.take("rope")
    player.move("north")
    player.take("lantern")
    player.move("south")
    player.move("east")
    assert player.room == "cottage", f"The player ended up in {player.room!r}"
    assert player.moves == 3, f"Three successful moves, but moves is {player.moves}."
    assert player.inventory_list() == ["lantern", "rope"], f"Got {player.inventory_list()}"
