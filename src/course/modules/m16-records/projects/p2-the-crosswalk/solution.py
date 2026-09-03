import csv
import json


def csv_to_json(csv_path, json_path):
    with open(csv_path, newline="") as handle:
        rows = list(csv.DictReader(handle))

    for row in rows:
        try:
            row["level"] = int(row["level"])
        except (ValueError, TypeError):
            row["level"] = 0

    with open(json_path, "w") as handle:
        json.dump(rows, handle, indent=2)

    return len(rows)
