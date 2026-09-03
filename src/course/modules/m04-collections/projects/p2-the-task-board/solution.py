def add_task(tasks, description):
    if description.strip() and description not in tasks:
        tasks.append(description)
    return tasks


def complete_task(tasks, description):
    if description in tasks:
        tasks.remove(description)
        return True
    return False
