# An expedition folder, scattered as real ones are.
import os, shutil

ROOT = "/workspace/expedition"


def reset_expedition():
    if os.path.exists("/workspace/expedition"):
        shutil.rmtree("/workspace/expedition")
    if os.path.exists("/workspace/photos"):
        shutil.rmtree("/workspace/photos")

    tree = {
        "": ["camp.jpg", "roster.txt"],
        "day2": ["ridge.jpg", "notes.md"],
        "day3/peak": ["SUMMIT.JPG", "map.png"],
    }
    for folder, names in tree.items():
        path = os.path.join(ROOT, folder) if folder else ROOT
        os.makedirs(path, exist_ok=True)
        for name in names:
            with open(os.path.join(path, name), "w") as handle:
                handle.write(name)


reset_expedition()
