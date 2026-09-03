Two workings, and the first is one line. Do that one, run it, then think about
the loop.

For the loop: an index starting at 0, a `while` that runs while the index is
less than the length, and an `i += 1` at the bottom.
---
Collect the hints in a list you make before the loop and `append` to inside it.

`break` is how you stop at `'correct'`. After the loop has finished, ask whether
`'correct'` ever made it into the list — if it did not, the round ran out.
---
```python
hints = []
i = 0
while i < len(guesses):
    guess = guesses[i]
    if guess < secret:
        hints.append("too low")
    elif guess > secret:
        hints.append("too high")
    else:
        hints.append("correct")
        break
    i += 1

if "correct" not in hints:
    hints.append("out of guesses")
return hints
```
