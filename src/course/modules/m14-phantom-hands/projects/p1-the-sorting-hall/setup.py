# Builds a messy folder for you to tidy up. It is rebuilt from scratch before
# every test, so you can experiment freely.
import os, shutil

WORKSPACE = "/workspace/downloads"

FILES = [
    "holiday.jpg",
    "cat.JPG",
    "logo.png",
    "diagram.gif",
    "notes.txt",
    "report.pdf",
    "README.md",
    "budget.csv",
    "archive.zip",
    "script.py",
    "LICENSE",
]


def reset_workspace():
    """Put /workspace back to its original mess."""
    if os.path.exists(WORKSPACE):
        shutil.rmtree(WORKSPACE)
    os.makedirs(WORKSPACE)

    for name in FILES:
        with open(os.path.join(WORKSPACE, name), "w") as handle:
            handle.write(f"contents of {name}\n")

    os.makedirs(os.path.join(WORKSPACE, "keep_me"))
    with open(os.path.join(WORKSPACE, "keep_me", "buried.txt"), "w") as handle:
        handle.write("do not touch me\n")


reset_workspace()
