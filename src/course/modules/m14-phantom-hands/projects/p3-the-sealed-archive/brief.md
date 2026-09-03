## The situation

The whole expedition folder needs to go to the guild in one piece — tree
structure, subfolders and all — as a single file somebody can send.

## What good looks like

```python
seal("/workspace/expedition", "/workspace/expedition.zip")
# 6
```

And what is inside it:

```python
['camp.jpg', 'roster.txt', 'day2/notes.md', 'day2/ridge.jpg',
 'day3/peak/SUMMIT.JPG', 'day3/peak/map.png']
```

Note what is **not** inside it: no `workspace`, no leading slash, no trace of
where the folder happened to live on your machine.

## Your objective

**`seal(folder, archive_path)`** — write a zip archive containing every file
beneath `folder`, and return how many files were written.

Each entry is named by its path **relative to `folder`**, so unpacking gives you
the folder's contents rather than a chain of directories.

## Watch out for

This is the single most common complaint about hand-rolled zip files. Call
`archive.write(full_path)` without an `arcname` and you store the *whole* path —
so somebody unpacking your backup gets `workspace/expedition/day2/notes.md`
buried inside wherever they unzipped it.

`os.path.relpath(full_path, folder)` computes exactly the name you want.

`zipfile.ZIP_DEFLATED` actually compresses. The default stores the bytes
uncompressed, which works but makes a pointlessly large file.
