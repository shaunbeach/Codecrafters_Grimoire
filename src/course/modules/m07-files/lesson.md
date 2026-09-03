# The Archive

Everything you have made so far died the moment it finished.

Every list, every dictionary, every carefully counted total — gone, the instant
the working stopped. You have been doing conjuring: impressive, immediate, and
leaving nothing behind.

An artisan does not conjure. An artisan **makes a thing that stays**. That is
the whole difference between this act and the last one, and it starts here, with
the least glamorous tool in the workshop: a file on a disk.

## Opening

```python
handle = open("scores.txt", "w")
handle.write("Kira,900\n")
handle.close()
```

That works, and you should never write it.

If anything between the open and the close raises, the file is left open and
your writing may never reach the disk at all. Use `with`, which closes the file
for you whatever happens:

```python
with open("scores.txt", "w") as handle:
    handle.write("Kira,900\n")
# closed here — even if the line above threw
```

`with` is one of the genuinely good ideas in Python. When you meet it again
around database connections and locks, it will be doing the same job: making
sure the tidying-up happens even when the work does not.

## Three ways in

| Mode | Means |
| --- | --- |
| `"r"` | read. The default. Errors if the file is not there. |
| `"w"` | write. **Creates the file, or empties an existing one.** |
| `"a"` | append. Creates if needed, adds to the end. |

That second one is the sharpest edge in this module. `open(path, "w")` does not
ask. It does not warn. The moment it runs, whatever was in that file is gone.

If you meant to add a line, you wanted `"a"`.

## Reading

```python
with open("scores.txt") as handle:
    text = handle.read()          # the whole file, as one string
```

```python
with open("scores.txt") as handle:
    for line in handle:           # one line at a time
        print(line.strip())
```

The second form never holds more than one line in memory, so it works on a file
larger than your machine. Prefer it once files stop being small.

**Every line you read still has its `"\n"` on the end**, including the invisible
one at the finish. `.strip()` removes it. Forgetting to strip is why `int(line)`
sometimes fails on what looks like a perfectly good number, and you will lose
twenty minutes to it exactly once.

`text.splitlines()` splits a whole string into lines with the newlines already
gone, which is usually what you wanted:

```python
lines = text.splitlines()          # ['Kira,900', 'Bo,750']
```

## Writing

`write()` does **not** add a newline. You do:

```python
with open("scores.txt", "w") as handle:
    for name, points in scores:
        handle.write(f"{name},{points}\n")
```

Miss that `\n` and your whole file becomes one very long line. It is an easy
mistake to make and an obvious one to spot.

## The file that is not there yet

The first time any program runs, its save file does not exist. Reading it raises
`FileNotFoundError`.

```python
import os
if os.path.exists(path):
    ...
```

```python
try:
    with open(path) as handle:
        ...
except FileNotFoundError:
    return []
```

The second is the more Pythonic — ask forgiveness, not permission — and it has
no gap between the checking and the opening in which the file could vanish. You
will meet `try` properly in the next module; either is fine today.

## Choosing a shape

When you write a file, you are choosing a format, and you are choosing it for
whoever has to read it next — including yourself, at two in the morning, in six
months.

Three things make a good one:

1. **It round-trips.** Load then save produces the same file.
2. **It is easy to parse** — one record per line, one obvious separator.
3. **A person can read it** in a text editor without any tools.

One record per line, fields separated by a comma, is a perfectly respectable
format:

```
Kira,900
Bo,750
```

To read a line back, split it and convert:

```python
name, points = line.split(",")
points = int(points)
```

Pick a separator your data cannot contain. A comma is wrong for anything with
prose in it; a tab or a pipe is often better. This is a real decision, not a
formality — CSV files with commas inside the fields have caused more quiet data
loss than almost anything else in computing.

## Comma-separated values, by hand

The whole world runs on CSV. Python has a `csv` module, and you will use it —
but writing the parser once teaches you what it is doing on your behalf.

```
name,maths,science
Kira,88,92
Bo,71,65
```

The first line is the **header**: it names the columns. Every line after is a
record, in the same order.

`.split(",")` cuts on every comma and keeps the empty pieces, which is right —
an empty field is real data and must not silently disappear:

```python
"Kira,88,92".split(",")      # ['Kira', '88', '92']
"Kira,,92".split(",")        # ['Kira', '', '92']
```

Then pair the header with each row and you have names instead of positions:

```python
headers = ["name", "maths"]
values = ["Kira", "88"]
dict(zip(headers, values))      # {'name': 'Kira', 'maths': '88'}
```

That single line is the heart of nearly every data-loading working you will ever
write.

## Everything off a disk is text

`"88"` is not `88`. You cannot add up strings:

```python
sum(["88", "92"])       # TypeError
```

Convert as you use them:

```python
total = sum(int(row["maths"]) for row in rows)
```

And guard the division. Averaging an empty list raises `ZeroDivisionError`, and
an empty file is not a rare event — it is the normal state of every file before
anybody has written to it.
