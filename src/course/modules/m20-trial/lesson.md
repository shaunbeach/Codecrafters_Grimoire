# The Summit

Everything from here is yours.

There is no new syntax in this module. You have all of it — loops, dictionaries,
files, classes, exceptions, and the whole of the outside world. What you have
not done yet is put it together into something with a shape, from nothing, with
nobody telling you what the pieces are.

That is the trial, and it is genuinely harder than any single working you have
written.

## Decide what it is before you decide how

The part beginners skip and experienced people spend longest on. Write the goal
in one sentence. If you cannot, the thing is still too vague to start, and no
amount of typing will fix that.

Then name the **data** before the behaviour. Most programmes are a shape of data
with workings arranged around it, and that shape determines everything else:

```python
{
    "room": "clearing",
    "inventory": [],
    "visited": ["clearing"],
    "moves": 0,
}
```

Ask of every field: who writes it, who reads it, and does it need to survive the
programme closing? Fields nobody reads are noise. Fields that must survive tell
you exactly what your save file contains.

## Make a fresh one every time

```python
def new_game_state():
    return {"room": "clearing", "inventory": [], "moves": 0}
```

A **working** that builds the state, not a constant. A module-level dict is
shared by every game, and mutating it in one place changes it everywhere — the
same trap as a mutable default argument, one level up.

## Stub it out, loudly

```python
def move(state, direction):
    """Move the player one room in `direction`. Returns a message."""
    raise NotImplementedError
```

This is not busywork:

- the docstring forces you to say what it does before you write it
- `raise NotImplementedError` fails **loudly**, unlike `pass`, which silently
  returns `None` and produces a confusing bug three workings away
- you can see the whole shape on one screen and notice the piece you forgot

## Let the data be data

```python
ROOMS = {
    "clearing": {
        "description": "A quiet clearing ringed by white birch trees.",
        "exits": {"north": "cave"},
        "items": ["rope"],
    },
}
```

No logic in there. A designer can add rooms without touching code, and your
checks can hand your classes a small fake map instead of the real one.

Which is why a `World` takes its rooms as an **argument** rather than importing
them itself. A class that reaches out and grabs its own data can only ever be
used one way. That is **dependency injection**, and it is most of what makes
code testable.

## Ask before you act

```python
def move(self, direction):
    destination = self.world.destination(self.room, direction)
    if destination is None:
        return "You cannot go that way."
    self.room = destination
    self.moves += 1
    return f"You go {direction}."
```

Failure first, returning immediately; the ordinary path then sits flat and
unindented underneath. Note too that a failed move does not cost a move — rules
like that are exactly what a method is for.

## Store names, not objects

`self.room` is a **string**, not the room dictionary. That is what makes the
player a small, saveable thing: `"clearing"` goes into a JSON file, a nest of
object references does not. Look the details up when you need them.

## Then make it survive a person

A save file can be missing, empty, half-written by a crash, or edited by
somebody curious. All four need the same answer: start fresh.

```python
try:
    with open(path) as handle:
        state = json.load(handle)
except (FileNotFoundError, ValueError):
    return new_state()

if not isinstance(state, dict) or not REQUIRED <= set(state):
    return new_state()
return state
```

Two layers, both necessary: the `try` handles the file not being readable, the
`isinstance` handles it being readable but wrong.

And the loop that can never crash:

```python
parts = line.strip().split()
if not parts:
    print("Say something, or type help.")
    continue
command, arguments = parts[0].lower(), parts[1:]
```

Every hostile input handled before you reach anything interesting: end of input,
an empty line, stray whitespace, capitals. Then the one everybody forgets:

```python
else:
    print(f"I do not understand '{command}'. Try help.")
```

**Never fail silently.** Somebody who typed the wrong thing needs to know what
was wrong and what to try instead.

## Before you call it done

- a `README.md` saying what it is and how to run it
- a `requirements.txt` if it needs anything from pip
- no absolute paths from your machine in the source
- no keys committed
- run it once from a fresh folder, as a stranger would

That last one finds more problems than any amount of re-reading.
