## The situation

`/workspace/downloads` is the folder everybody has: eleven files, four kinds,
no order. Somebody sorts it by hand every Friday.

Not any more.

## What good looks like

```python
organise("/workspace/downloads")
# {
#   'images': ['cat.JPG', 'diagram.gif', 'holiday.jpg', 'logo.png'],
#   'documents': ['README.md', 'budget.csv', 'notes.txt', 'report.pdf'],
#   'other': ['LICENSE', 'archive.zip', 'script.py'],
# }
```

| Folder | Extensions |
| --- | --- |
| `images` | jpg, jpeg, png, gif |
| `documents` | txt, md, pdf, csv |
| `other` | everything else, including files with no extension |

## Your objective

**`organise(folder)`** — move every **file** into the right subfolder, creating
the subfolders as needed, and return a dict of what moved with each list
**sorted**.

- extension matching ignores case, so `cat.JPG` is an image
- existing subfolders and their contents are left completely alone
- running it a second time is safe and moves nothing

## Watch out for

**Decide everything before you change anything.** Build the list of moves first,
then perform them. A loop that creates `images/` while iterating over the folder
it is reading can descend into its own output and start moving files it has
already moved.

`os.path.isfile` is what keeps you out of the folders. Without it your first run
will try to move `keep_me/` into `other/`.

`os.makedirs(..., exist_ok=True)` is what makes the second run safe.
