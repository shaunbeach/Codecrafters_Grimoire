Deal with the small cases first: anything less than 2 is not prime, full stop.
Get that guard in, then think about the loop.
---
Loop over the possible divisors starting at 2. If any of them divides `n`
exactly — `n % divisor == 0` — you have your answer and can return straight
away.

The `return True` goes **after** the loop, not inside it. Putting it inside
means you decide on the first divisor you test rather than on all of them.
---
```python
if n < 2:
    return False

for divisor in range(2, int(n ** 0.5) + 1):
    if n % divisor == 0:
        return False

return True
```

`range(2, 2)` is empty, which is why 2 and 3 come out true without any special
handling.
