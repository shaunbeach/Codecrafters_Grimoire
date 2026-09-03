def count_level(path, level):
    prefix = level + ":"
    try:
        with open(path) as handle:
            count = 0
            for line in handle:
                if line.strip().startswith(prefix):
                    count += 1
            return count
    except FileNotFoundError:
        return 0
