# The Vault

You can write a file. You can read one back. You can build an object that
guards its own rules.

Put those three together and you have the shape that nearly every programme you
will ever write is made of:

```python
state = load(PATH)        # disk  -> memory
change(state, something)  # work, in memory
save(PATH, state)         # memory -> disk
```

Load, change, save. That is it. A text editor does it. A bank does it. The thing
running your phone does it several thousand times a second. Everything else is
detail.

## Work in memory, save at the end

Do not re-read the file for every small change. It is slow, and — much worse —
it makes it impossible to say what the true state of the thing is at any given
moment. Read once. Work on what you have. Write once.

The moment you have two sources of truth, you have a bug you cannot reproduce.

## The format is a decision

When you write a file you are choosing a format, and you are choosing it for
whoever reads it next. Three properties matter:

1. **It round-trips.** Load then save produces the same file. If it does not,
   your programme is quietly losing something every time it runs.
2. **It is easy to parse** — one record per line, one obvious separator.
3. **A person can read it** in an editor at two in the morning.

For `{"reading": 12}`:

```
reading:12
exercise:5
```

Pick a separator your data cannot contain. A colon is safe for habit names; a
comma would be a poor choice for anything with prose in it.

## Parse defensively

Files get edited by hand, and they go stale. Skip what you cannot understand
rather than falling over:

```python
for line in text.splitlines():
    line = line.strip()
    if not line or ":" not in line:
        continue
    name, _, count = line.partition(":")
```

`partition(":")` splits on the **first** colon only and always returns three
pieces, so it can never raise "not enough values to unpack" the way `split(":")`
with unpacking can. When the separator is missing, the middle piece is empty —
which is how you detect it.

## Write deterministically

```python
with open(path, "w") as handle:
    for name in sorted(habits):
        handle.write(f"{name}:{habits[name]}\n")
```

Sorting the keys before saving makes the file **byte-identical** for the same
data, every time. That is what makes a file diffable, and it costs one word.

A save file whose line order shuffles on every run is one you cannot put in
version control, cannot compare against yesterday's, and cannot review.

## Content belongs in data, not in code

The other half of this module. Look at these two programmes:

```python
questions = [("What is the capital of France?", "Paris")]     # in the code
```

```python
questions = load_questions("questions.txt")                    # in a file
```

The second can grow a new quiz without a single line changing. Somebody who does
not program can edit it. You can ship a hundred of them.

The first requires you, every time.

This is one of the most useful instincts in software, and it is almost never
about cleverness — it is about noticing that the *content* and the *machinery*
are different things, and refusing to weld them together.

```
What is the capital of France?|Paris
What is 2 + 2?|4
```

Why a pipe rather than a comma? Because questions contain commas. Choose a
separator your data will never hold.

## Compare what humans typed, gently

```python
if answer.strip().lower() == correct.strip().lower():
    score += 1
```

Strip and lower **both sides**. Doing it only to the user's answer leaves you
exposed to a stray space in your own data file, which is precisely the kind of
bug that takes an hour and ends in embarrassment.

## Guard the division

```python
percent = round(100 * score / len(questions)) if questions else 0
```

A quiz with no questions is not an exotic case — it is what an empty file gives
you, and an empty file is the normal state of every file before anyone has
written to it.

That is a **conditional expression**: `value_if_true if condition else
value_if_false`. Useful for exactly this kind of one-line default, and worth
using sparingly — anything longer than a line is clearer as a real `if`.
