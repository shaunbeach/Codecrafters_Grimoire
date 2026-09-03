## The situation

The photographs are somewhere in `/workspace/expedition` — some at the top,
some three folders down, some beside notes and maps and a spare copy of the
roster. Nobody remembers where.

Reach through the whole tree and bring back only the ones you want.

## What good looks like

```python
gather("/workspace/expedition", "/workspace/photos", "jpg")
# ['camp.jpg', 'ridge.jpg', 'summit.jpg']
```

`/workspace/photos` afterwards holds those three files. **The originals are
still where they were** — this is a copy, not a move.

## Your objective

**`gather(source, destination, extension)`** — walk `source` and everything
beneath it, copy every file with that extension into `destination`, and return
the copied filenames **sorted**.

- the destination is created if it does not exist
- matching ignores case: `RIDGE.JPG` matches `"jpg"`
- the extension is given without a dot

## Watch out for

`os.walk` hands you `(root, dirs, files)` for every folder in the tree. The
`files` are bare names — you have to `os.path.join(root, name)` to get something
you can actually open.

This copies rather than moves, because a gathering script that is wrong should
not also be destructive. Copy first, delete later, once you have looked.
