`os.walk` gives you every folder in the tree, one at a time, with the files
inside it. That is the entire traversal — you do not need recursion of your own.
---
```python
for root, dirs, files in os.walk(source):
    for name in files:
        ...
```

Compare `name.lower().endswith("." + extension.lower())`.

`shutil.copy(full_path, destination)` puts it in the folder; you do not have to
name the target file.
---
```python
os.makedirs(destination, exist_ok=True)
suffix = "." + extension.lower()

found = []
for root, _dirs, files in os.walk(source):
    for name in files:
        if name.lower().endswith(suffix):
            shutil.copy(os.path.join(root, name), destination)
            found.append(name)
return sorted(found)
```
