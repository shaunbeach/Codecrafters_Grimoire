## The situation

Apprentices have been set this rite for as long as anyone can remember, and it
is still asked at guild examinations today. It looks trivial. Most people who
fail it fail on one specific thing, and you have already been warned about that
thing.

## What good looks like

```python
fizzbuzz(5)
# ['1', '2', 'Fizz', '4', 'Buzz']

fizzbuzz(15)[-1]
# 'FizzBuzz'

fizzbuzz(0)
# []
```

## Your objective

**`fizzbuzz(n)`** — return a **list of strings**, one for each number from 1 to
`n` inclusive:

- divisible by 3 **and** 5 → `'FizzBuzz'`
- divisible by 3 → `'Fizz'`
- divisible by 5 → `'Buzz'`
- otherwise → the number itself, as a string

## Watch out for

Every entry is a string, including the plain numbers. `str(4)` gives `'4'`.

Fifteen is divisible by three. If you test for three first, you will never reach
the FizzBuzz case — and your list will look right for the first fourteen
entries, which is exactly why this catches people.

`range(1, n + 1)` counts 1 through n. `range(n)` counts 0 through n-1, which is
one short at both ends here.
