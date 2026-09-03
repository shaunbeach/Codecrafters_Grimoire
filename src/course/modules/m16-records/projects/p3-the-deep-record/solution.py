def dig(data, path, default=None):
    current = data
    for step in path:
        if isinstance(step, int):
            if not isinstance(current, list) or not (0 <= step < len(current)):
                return default
        else:
            if not isinstance(current, dict) or step not in current:
                return default
        current = current[step]
    return current
