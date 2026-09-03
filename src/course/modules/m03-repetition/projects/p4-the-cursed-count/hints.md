An accumulator and a `for` loop. The two superstitions are two `if` statements
at the top of the loop body, before anything is added.
---
Order matters slightly: check for the void before the curse, or after — either
works here, because a number cannot be both. What matters is that both checks
come *before* the addition.

`continue` for the 13. `break` for the 0.
---
```python
total = 0
for number in numbers:
    if number == 0:
        break
    if number == 13:
        continue
    total += number
return total
```

Note how flat that is. Every case gets one line and then gets out of the way.
