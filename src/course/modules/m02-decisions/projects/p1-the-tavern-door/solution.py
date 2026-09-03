def check_entry(age, has_id):
    if not has_id:
        return "No ID, no entry."
    elif age < 18:
        return f"Come back in {18 - age} years."
    elif age < 100:
        return "Welcome to the Rusty Tankard!"
    else:
        return "Free ale for the elders!"
