def hailstone(n):
    # your code here
    pass


if __name__ == "__main__":
    print(hailstone(6))
    print("longest under 30:", max((len(hailstone(i)), i) for i in range(1, 30)))
