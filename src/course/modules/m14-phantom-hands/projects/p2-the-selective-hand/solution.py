import os
import shutil


def gather(source, destination, extension):
    os.makedirs(destination, exist_ok=True)
    suffix = "." + extension.lower()

    found = []
    for root, _dirs, files in os.walk(source):
        for name in files:
            if name.lower().endswith(suffix):
                shutil.copy(os.path.join(root, name), destination)
                found.append(name)
    return sorted(found)
