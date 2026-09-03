def dig(data, path, default=None):
    # your code here
    pass


if __name__ == "__main__":
    data = {"results": [{"address": {"city": "Marrow Ford"}}], "count": 1}
    print(dig(data, ["results", 0, "address", "city"]))
    print(dig(data, ["results", 9, "address"], "missing"))
