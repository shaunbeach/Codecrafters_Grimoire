# The Sorting Hall

Somewhere there is a folder with four thousand files in it, and a person who
opens it every Friday and drags things into other folders for two hours.

You are about to grow a second pair of hands that do it in nine milliseconds,
and never get bored, and never put the invoice in the photographs folder.

This is the most immediately useful magic in the grimoire and the most
dangerous. The hands do exactly what you say. They do not check whether you
meant it.

## Speaking about places

Never build a path with `+` and a slash. Windows uses backslashes, and a doubled
or missing separator will bite you the first time somebody else runs your code:

```python
import os

os.path.join("/workspace", "images", "cat.jpg")   # '/workspace/images/cat.jpg'
```

```python
os.path.basename("/workspace/cat.jpg")     # 'cat.jpg'
os.path.dirname("/workspace/cat.jpg")      # '/workspace'
os.path.splitext("cat.jpg")                # ('cat', '.jpg')  — note the dot
os.path.exists(path)                       # True / False
os.path.isdir(path)                        # is it a folder?
os.path.isfile(path)                       # is it a file?
```

`splitext` gives you the extension **with** its dot, in whatever case the user
typed. Normalise both:

```python
extension = os.path.splitext(name)[1].lower().lstrip(".")     # 'jpg'
```

A file with no extension gives `''`, which is worth deciding about before it
surprises you.

## Looking

```python
os.listdir("/workspace")     # ['cat.jpg', 'notes.txt', 'keep_me']
```

You get names, not paths, and folders mixed in with files. So the loop you
almost always want is:

```python
for name in os.listdir(folder):
    full = os.path.join(folder, name)
    if not os.path.isfile(full):
        continue
    ...
```

`os.walk(folder)` goes deeper, handing you every folder beneath as you go:

```python
for root, dirs, files in os.walk(folder):
    for name in files:
        print(os.path.join(root, name))
```

## Making and moving

```python
os.mkdir(path)                            # fails if it already exists
os.makedirs(path, exist_ok=True)          # makes parents too, and is idempotent
```

```python
import shutil

shutil.move(source, destination)      # move, even across drives
shutil.copy(source, destination)      # copy
shutil.rmtree(folder)                 # delete a folder AND everything in it
os.remove(path)                       # delete one file
```

`exist_ok=True` is what you want in anything that might run twice.

## The warning

`shutil.rmtree` does not ask. It does not use the recycle bin. It cannot be
undone.

Every experienced programmer has a story here, and you do not need your own.
Before a destructive script does anything real, make it a **dry run**:

```python
for name in doomed:
    print(f"would delete {name}")     # comment out the real call until you trust it
```

And one rule that will save you at least once: **decide everything before you
change anything.** Build the list of moves first, then perform them. A loop that
creates folders while it is iterating over the folder it is reading will
eventually descend into its own output and start moving files it has already
moved.

## Sealing things up

```python
import zipfile

with zipfile.ZipFile("backup.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    archive.write("notes.txt", arcname="notes.txt")

with zipfile.ZipFile("backup.zip") as archive:
    archive.namelist()          # ['notes.txt']
    archive.extractall("/out")
```

`arcname` is what the file is called **inside** the archive. Without it you
store the whole path — so a backup made on your machine unpacks into
`Users/you/Documents/...` on somebody else's, which is the single most common
complaint about hand-rolled zip files.

## Hands you cannot see

The other half of this module is stranger. `pyautogui` moves the actual mouse
and presses the actual keys — it drives programmes that have no API at all, by
pretending to be a person.

```python
import pyautogui

pyautogui.moveTo(300, 200)
pyautogui.click(500, 400)
pyautogui.write("hello")
pyautogui.press("enter")
pyautogui.hotkey("ctrl", "s")

spot = pyautogui.locateCenterOnScreen("submit.png")
if spot is None:
    raise ValueError("Image not found on screen")
pyautogui.click(spot)
```

> A browser tab cannot drive your mouse, and should not be able to. This
> grimoire supplies a stand-in with the same signatures that records every
> action instead of performing it — so the code you write is real code, and you
> can see exactly where the phantom hands went.

Two things about the real library. `locateCenterOnScreen` returns `None` when it
cannot find the image, so it is a `if spot is None` away from a `TypeError`. And
`pyautogui.FAILSAFE` is on by default: slamming the real mouse into the top-left
corner of the screen aborts the script. That exists because a loop with a
mistake in it can take control of a machine away from the person sitting at it,
and they need a way to take it back.

Grow the hands. Respect them.
