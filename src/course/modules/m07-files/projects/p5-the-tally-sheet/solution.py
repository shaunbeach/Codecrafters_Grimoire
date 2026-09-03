def parse_csv(path):
    with open(path) as handle:
        lines = handle.read().splitlines()

    if not lines:
        return []

    headers = lines[0].split(",")
    rows = []
    for line in lines[1:]:
        if not line.strip():
            continue
        rows.append(dict(zip(headers, line.split(","))))
    return rows
