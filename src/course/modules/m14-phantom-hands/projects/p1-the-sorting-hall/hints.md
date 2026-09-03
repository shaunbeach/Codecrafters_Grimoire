Two passes. First walk the folder and work out where each file *should* go,
collecting `(name, category)` pairs. Then loop over that plan and move them.
---
The category comes from the extension:
`os.path.splitext(name)[1].lower().lstrip(".")`. Check it against each list in
your mapping; anything unmatched is `'other'`.

Skip anything `os.path.isfile` says is not a file.

Sort each list of moved names at the end, not as you go.
---
```python
plan = []
for name in os.listdir(folder):
    if not os.path.isfile(os.path.join(folder, name)):
        continue
    plan.append((name, category_for(name)))

for name, category in plan:
    destination = os.path.join(folder, category)
    os.makedirs(destination, exist_ok=True)
    shutil.move(os.path.join(folder, name), os.path.join(destination, name))
    moved[category].append(name)
```
