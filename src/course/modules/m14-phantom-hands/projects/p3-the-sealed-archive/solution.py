import os
import zipfile


def seal(folder, archive_path):
    count = 0
    with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for root, _dirs, files in os.walk(folder):
            for name in files:
                full = os.path.join(root, name)
                archive.write(full, arcname=os.path.relpath(full, folder))
                count += 1
    return count
