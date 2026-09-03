def read_scroll(record):
    # your code here
    pass


if __name__ == "__main__":
    for scroll in ({"name": "Kira", "age": 30}, {"age": "nope"}, "not a scroll"):
        print(read_scroll(scroll))
