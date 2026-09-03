Build a list before the loop, append one entry per number, return it after. The
loop itself is `for number in range(1, n + 1)`.
---
Four cases in one `if / elif / else` chain, and the order is the whole exercise.
The both-case has to be tested first — either as `number % 15 == 0` or as
`number % 3 == 0 and number % 5 == 0`.

The last branch is the only one that needs `str()`.
---
```python
result = []
for number in range(1, n + 1):
    if number % 15 == 0:
        result.append("FizzBuzz")
    elif number % 3 == 0:
        result.append("Fizz")
    elif number % 5 == 0:
        result.append("Buzz")
    else:
        result.append(str(number))
return result
```
