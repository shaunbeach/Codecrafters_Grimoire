def common_allies(a, b):
    shared = []
    for name in a:
        if name in b and name not in shared:
            shared.append(name)
    return sorted(shared)
