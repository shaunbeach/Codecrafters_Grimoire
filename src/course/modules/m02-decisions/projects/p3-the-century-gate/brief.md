## The situation

The gate to the inner archive opens once a year, on a day that does not exist in
most years. The keeper needs to know which years have it.

The rule is genuinely strange, and it is a real rule that real calendars use:

- a year divisible by **4** carries the extra day
- **unless** it is divisible by 100, in which case it does not
- **unless** it is also divisible by 400, in which case it does after all

So 2024 has it. 1900 did not. 2000 did.

## What good looks like

```python
is_leap_year(2024)    # True
is_leap_year(2023)    # False
is_leap_year(1900)    # False
is_leap_year(2000)    # True
```

## Your objective

**`is_leap_year(year)`** — return `True` or `False`.

Return the boolean itself, not the string `'True'`.

## Watch out for

`year % 4 == 0` asks "does 4 divide this year exactly?" — the remainder is zero
when it does. That single expression is the whole of the arithmetic here; the
difficulty is entirely in the shape of the rule.

There is a version of this that is one line long. There is also a version that
is four ifs. Both are correct. Write whichever one you can still read tomorrow.
