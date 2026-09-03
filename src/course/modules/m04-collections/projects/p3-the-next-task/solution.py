def next_task(tasks):
    if tasks:
        return tasks.pop(0)
    return None


def pending_tasks(tasks):
    numbered = []
    for index, description in enumerate(tasks, start=1):
        numbered.append(f"{index}. {description}")
    return numbered

