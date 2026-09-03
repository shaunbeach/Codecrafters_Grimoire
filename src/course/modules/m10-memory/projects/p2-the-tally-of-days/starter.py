# load_habits and save_habits are already here, from the previous working.


def record_day(habits, name):
    # your code here
    pass


def streak_report(habits):
    # your code here
    pass


if __name__ == "__main__":
    habits = load_habits("/workspace/habits.txt")
    record_day(habits, "reading")
    save_habits("/workspace/habits.txt", habits)
    print(streak_report(habits))
