import os
import shutil

FOLDERS = {
    "images": ["jpg", "jpeg", "png", "gif"],
    "documents": ["txt", "md", "pdf", "csv"],
}


def category_for(name):
    extension = os.path.splitext(name)[1].lower().lstrip(".")
    for category, extensions in FOLDERS.items():
        if extension in extensions:
            return category
    return "other"


def organise(folder):
    moved = {"images": [], "documents": [], "other": []}

    # Decide everything before touching anything.
    plan = []
    for name in os.listdir(folder):
        source = os.path.join(folder, name)
        if not os.path.isfile(source):
            continue
        plan.append((name, category_for(name)))

    for name, category in plan:
        destination = os.path.join(folder, category)
        os.makedirs(destination, exist_ok=True)
        shutil.move(os.path.join(folder, name), os.path.join(destination, name))
        moved[category].append(name)

    for names in moved.values():
        names.sort()
    return moved
