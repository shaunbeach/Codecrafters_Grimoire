`os.walk` again for the traversal. The new part is the archive, and it is a
`with` block like every other file you have opened.
---
```python
with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as archive:
    ...
```

Inside, for each file: build the full path, compute
`os.path.relpath(full, folder)`, and call
`archive.write(full, arcname=relative)`.

Count as you go and return the count.
---
```python
count = 0
with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as archive:
    for root, _dirs, files in os.walk(folder):
        for name in files:
            full = os.path.join(root, name)
            archive.write(full, arcname=os.path.relpath(full, folder))
            count += 1
return count
```
