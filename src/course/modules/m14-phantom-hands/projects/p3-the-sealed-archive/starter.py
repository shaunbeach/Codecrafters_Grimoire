import os
import zipfile


def seal(folder, archive_path):
    # your code here
    pass


if __name__ == "__main__":
    print(seal("/workspace/expedition", "/workspace/expedition.zip"))
    with zipfile.ZipFile("/workspace/expedition.zip") as archive:
        print(archive.namelist())
