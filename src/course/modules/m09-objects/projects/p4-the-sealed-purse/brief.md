## The situation

A purse held as a plain number can be set to minus forty by any line of code
anywhere in the programme, and you will never find out which one.

A sealed purse has no such line. There is one way in and one way out, and both
of them check.

## What good looks like

```python
purse = Purse(50)

purse.add(25)          # 75
purse.spend(30)        # 45
purse.balance          # 45
len(purse)             # 45
str(purse)             # 'a purse of 45 coins'

purse.spend(100)       # ValueError: cannot spend 100 from 45
purse.add(-5)          # ValueError: cannot add a negative amount: -5
Purse(-1)              # ValueError: a purse cannot start with -1
```

## Your objective

**`Purse(balance=0)`** — refuses to be created with a negative balance.

- **`add(amount)`** — increase the balance; return the new balance. A negative
  amount raises `ValueError`
- **`spend(amount)`** — decrease it; return the new balance. A negative amount,
  or more than the purse holds, raises `ValueError` naming both numbers
- **`__len__()`** — the balance, so `len(purse)` works
- **`__str__()`** — `'a purse of 45 coins'`

## Watch out for

Every rule is enforced **inside the class**. There is no arrangement of calls
from outside that can leave a purse holding less than nothing — that is what
makes it sealed, and it is the whole reason to prefer a class over a number
here.

`__len__` must return a non-negative `int`, which is why the invariant matters:
Python itself raises if it does not.
