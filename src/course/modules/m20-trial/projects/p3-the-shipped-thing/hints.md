Do the three small workings first — `new_state`, `save_game`, `load_game` — and
check them. The loop is the last thing, and it is easier once loading is solid.
---
For the loop, handle the hostile cases before you get anywhere near a command:

```python
try:
    line = input("> ")
except EOFError:
    return state

parts = line.strip().split()
if not parts:
    print("Say something, or type help.")
    continue

command, arguments = parts[0].lower(), parts[1:]
```

Then one `if`/`elif` per command, with the `else` naming what it did not
understand. `quit` returns; everything else falls to the bottom and increments
`moves`.
---
```python
if command == "quit":
    print("Goodbye.")
    state["moves"] += 1
    return state

if command == "look":
    print(f"You are in the {state['room']}.")
elif command == "take":
    if not arguments:
        print("Take what?")
        continue
    state["inventory"].append(arguments[0])
    print(f"You take the {arguments[0]}.")
...
else:
    print(f"I do not understand '{command}'. Try help.")
    continue

state["moves"] += 1
```
