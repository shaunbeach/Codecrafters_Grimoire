## The situation

The herald's cry worked, but the guild now wants variations — with a rank, or
without, shouted or spoken. Writing four separate workings would be four places
to fix when somebody changes the wording.

One working, with parts that are optional.

## What good looks like

| Call | Returns |
| --- | --- |
| `greet("Kira")` | `'Hello, Kira.'` |
| `greet("Kira", "Captain")` | `'Hello, Captain Kira.'` |
| `greet("Kira", excited=True)` | `'HELLO, KIRA!'` |
| `greet("Kira", "Captain", True)` | `'HELLO, CAPTAIN KIRA!'` |

```python
shout_all(["Kira", "Bo"])     # ['HELLO, KIRA!', 'HELLO, BO!']
shout_all([])                 # []
```

## Your objective

**`greet(name, title="", excited=False)`** — return the greeting. When
`excited` is true the whole string is shouted and the full stop becomes an
exclamation mark.

**`shout_all(names)`** — return a list with every name greeted excitedly, no
title. **Call `greet` to do the work.**

## Watch out for

`greet("Kira", excited=True)` has no title, and the result is
`'HELLO, KIRA!'` — not `'HELLO,  KIRA!'` with two spaces where the missing title
would have gone. Build the middle carefully.

The second working must not rebuild the greeting. If it does, changing the
wording means changing it twice, and one day you will change only one.
