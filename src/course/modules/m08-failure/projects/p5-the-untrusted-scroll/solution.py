DEFAULTS = {"name": "anonymous", "age": 0, "town": "unknown"}


def read_scroll(record):
    if not isinstance(record, dict):
        return dict(DEFAULTS)

    name = str(record.get("name") or "").strip() or "anonymous"
    town = str(record.get("town") or "").strip() or "unknown"

    try:
        age = int(record.get("age"))
    except (ValueError, TypeError):
        age = 0
    if age < 0:
        age = 0

    return {"name": name, "age": age, "town": town}
