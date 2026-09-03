## The situation

The warding stones are cut in prime numbers. A stone whose count can be divided
evenly can be split by anything that wants in, and the guild lost a vault that
way once.

## What good looks like

```python
is_prime(7)     # True
is_prime(9)     # False    3 divides it
is_prime(2)     # True     the only even prime
is_prime(1)     # False    one is not prime
is_prime(-7)    # False
```

## Your objective

**`is_prime(n)`** — return `True` when `n` is prime, `False` otherwise.

A prime is a whole number greater than 1 whose only divisors are 1 and itself.
So 1 is not prime, and nor is anything below it.

## Watch out for

This is a search for a **counter-example**. You are not trying to prove the
number is prime; you are looking for a single divisor, and the moment you find
one you can stop and say no.

That shape — loop, find the disqualifying case, `return False` immediately, and
`return True` only after the loop has finished without finding one — is worth
recognising. You will write it for the rest of your life.

You do not need to test every number up to `n`. If a divisor exists, one of the
pair is no larger than the square root, so `range(2, int(n ** 0.5) + 1)` is
enough. Correct either way; this one is simply faster.
