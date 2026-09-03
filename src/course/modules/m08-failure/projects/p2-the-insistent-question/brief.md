## The situation

**Step 2 of 2 — The Insistent Prompt.**

`safe_int` never crashes, but it also never complains — hand it a word and it
quietly gives you zero, and somebody's age is now nought.

Sometimes you do not want a default. You want the answer, and you are prepared
to keep asking.

Press **Run** on this one. It genuinely waits for you.

## What good looks like

```
Age? banana
That is not a whole number.
Age? 
That is not a whole number.
Age? 42
```

```python
ask_for_number("Age? ")     # 42
```

## Your objective

**`ask_for_number(prompt)`** — call `input(prompt)` over and over until it is
given a whole number, then return it as an `int`.

On each bad answer, print exactly `That is not a whole number.` and ask again.

## Watch out for

`while True` with a `return` inside the `try` is the whole shape. The `return`
is what ends the loop; a bad answer falls past it into the `except` and goes
round again.

The prompt has to reach `input()`. Printing it separately looks the same in a
terminal, but it is not the same — `input(prompt)` is what puts the cursor on
the same line as the question.

This loop cannot exit on its own. That is correct here, and it is exactly why
the fifteen-second guard is suspended while a working is waiting for you.
