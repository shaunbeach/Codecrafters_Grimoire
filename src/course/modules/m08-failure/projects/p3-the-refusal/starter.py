def carriage_cost(weight):
    # your code here
    pass


if __name__ == "__main__":
    print(carriage_cost(2), carriage_cost(10))
    try:
        carriage_cost(-4)
    except ValueError as exc:
        print("refused:", exc)
