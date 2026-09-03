## The situation

**Step 3 of 3 — The Trial. The last working in the grimoire.**

The logic works. What separates it from something a person could actually use is
the last ten percent: it remembers, it explains itself, and it never dies because
somebody pressed Enter twice.

Press **Run**. It will play with you.

## What good looks like

```
> look
You are in the clearing.
> take rope
You take the rope.
> inventory
You are carrying: rope
> xyzzy
I do not understand 'xyzzy'. Try help.
> save
Game saved.
> quit
Goodbye.
```

## Your objective

**`new_state()`** — `{'room': 'clearing', 'inventory': [], 'moves': 0}`.

**`save_game(path, state)`** — write it as JSON.

**`load_game(path)`** — read it back. Return `new_state()` if the file is
missing, is not valid JSON, is not a dict, or is missing any of the three keys.
**It must never raise.**

**`play(path)`** — load, then loop on `input("> ")`:

| Typed | Prints |
| --- | --- |
| `look` | `You are in the clearing.` |
| `take rope` | `You take the rope.` |
| `take` | `Take what?` |
| `inventory` | `You are carrying: coin, rope` or `You are carrying nothing.` |
| `save` | `Game saved.` |
| `help` | the help text |
| `quit` | `Goodbye.` and stop |
| *(empty)* | `Say something, or type help.` |
| anything else | `I do not understand 'xyzzy'. Try help.` |

Commands are case-insensitive. Every **understood** command adds 1 to `moves`;
an empty line or an unknown command does not. Inventory listings are sorted.
Running out of input ends the loop as cleanly as `quit`. Return the final state.

## Watch out for

Two layers of defence on loading, and both are needed: the `try` for a file that
will not read, and the shape check for one that reads and is wrong. A file
containing `null` parses perfectly and breaks everything downstream.

**Never fail silently.** The `else` branch that names the command somebody typed
is the single most useful line in the whole working.

Catch `EOFError` around `input()`. A closed stream is an ending, not a crash.
