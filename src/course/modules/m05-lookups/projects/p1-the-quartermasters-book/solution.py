def add_item(inventory, name, quantity=1):
    inventory[name] = inventory.get(name, 0) + quantity
    return inventory


def remove_item(inventory, name, quantity=1):
    if name not in inventory:
        return False
    inventory[name] -= quantity
    if inventory[name] <= 0:
        del inventory[name]
    return True


def inventory_report(inventory):
    lines = []
    for name in sorted(inventory):
        lines.append(f"{name} x{inventory[name]}")
    return lines
