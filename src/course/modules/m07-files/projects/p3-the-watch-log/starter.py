def count_level(path, level):
    # your code here
    pass


if __name__ == "__main__":
    for level in ("INFO", "WARN", "ERROR", "FATAL"):
        print(level, count_level("/data/watch.log", level))
