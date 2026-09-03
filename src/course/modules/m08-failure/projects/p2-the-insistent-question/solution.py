def ask_for_number(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("That is not a whole number.")

