def test_add_creates_and_increments():
    """add_item starts new entries and adds to existing ones"""
    add_item = require("add_item")
    inventory = {}
    add_item(inventory, "gold", 50)
    assert inventory == {"gold": 50}, f"Expected {{'gold': 50}}, got {inventory}"
    add_item(inventory, "gold", 25)
    assert inventory == {"gold": 75}, (
        f"Expected the counts to add up to 75, got {inventory}. "
        "inventory.get(name, 0) gives you a safe starting point."
    )


def test_add_defaults_to_one():
    """The quantity defaults to 1"""
    add_item = require("add_item")
    inventory = {}
    add_item(inventory, "rope")
    assert inventory == {"rope": 1}, f"Expected {{'rope': 1}}, got {inventory}"


def test_remove_decrements():
    """remove_item lowers the count"""
    remove_item = require("remove_item")
    inventory = {"health_potion": 3}
    assert remove_item(inventory, "health_potion") is True
    assert inventory == {"health_potion": 2}, f"Got {inventory}"


def test_remove_deletes_at_zero():
    """An item that runs out is deleted, not left at zero"""
    remove_item = require("remove_item")
    inventory = {"rope": 1, "gold": 5}
    remove_item(inventory, "rope")
    assert "rope" not in inventory, (
        f"'rope' should be gone entirely, but the inventory is {inventory}."
    )
    remove_item(inventory, "gold", 99)
    assert inventory == {}, f"Removing more than you have should clear the key. Got {inventory}"


def test_remove_missing_item():
    """Removing something you never had returns False and changes nothing"""
    remove_item = require("remove_item")
    inventory = {"gold": 5}
    try:
        result = remove_item(inventory, "sword")
    except KeyError:
        raise AssertionError(
            "remove_item raised KeyError. Check `if name not in inventory` first."
        )
    assert result is False, "Removing an absent item should return False."
    assert inventory == {"gold": 5}, f"The inventory should be untouched, got {inventory}"


def test_report_is_sorted():
    """The report is alphabetical, whatever order things were added"""
    inventory_report = require("inventory_report")
    result = inventory_report({"health_potion": 3, "gold": 50, "amulet": 1})
    assert result == ["amulet x1", "gold x50", "health_potion x3"], f"Got {result}"


def test_report_of_empty_bag():
    """An empty inventory reports an empty list"""
    inventory_report = require("inventory_report")
    assert inventory_report({}) == [], f"Got {inventory_report({})}"
