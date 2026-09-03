Put `n` into the list before the loop starts. Then loop while `n` is not yet 1,
changing `n` and appending it each time round.
---
`n % 2 == 0` asks whether it is even. `n // 2` halves it and keeps it a whole
number; `n / 2` would give you a float.

Reassign `n` itself inside the loop — that is what moves the condition toward
being false.
---
```python
path = [n]
while n != 1:
    if n % 2 == 0:
        n = n // 2
    else:
        n = 3 * n + 1
    path.append(n)
return path
```
