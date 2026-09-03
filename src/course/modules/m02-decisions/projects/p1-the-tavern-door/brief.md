## The situation

The Rusty Tankard has a doorman with a very simple set of rules and no patience
for argument. He would like them written down so that he can stop having the
same conversation every night.

## What good looks like

```python
check_entry(25, True)     # 'Welcome to the Rusty Tankard!'
check_entry(15, True)     # 'Come back in 3 years.'
check_entry(40, False)    # 'No ID, no entry.'
check_entry(101, True)    # 'Free ale for the elders!'
```

## Your objective

**`check_entry(age, has_id)`** — return exactly one of these:

| Situation | Return |
| --- | --- |
| no ID | `'No ID, no entry.'` |
| under 18 | `'Come back in N years.'` — N is how many years short they are |
| 18 to 99 | `'Welcome to the Rusty Tankard!'` |
| 100 or older | `'Free ale for the elders!'` |

## Watch out for

The ID comes first. Somebody who is ninety and has forgotten their papers is
still turned away, and if you test the age first you will let them in.

100 counts as an elder. When a rule says "or older", check that the boundary
itself lands where you meant it to — off-by-one at a boundary is the single most
common bug in conditional code.
