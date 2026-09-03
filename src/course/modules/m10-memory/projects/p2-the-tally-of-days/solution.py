def record_day(habits, name):
    habits[name] = habits.get(name, 0) + 1
    return habits[name]


def streak_report(habits):
    ordered = sorted(habits.items(), key=lambda entry: (-entry[1], entry[0]))
    return [f"{name}: {count} days" for name, count in ordered]

