## The situation

The counting of the day's takings happens at midnight, unattended, and if
anything is wrong nobody is there to see it. `print()` into an empty room helps
nobody.

Write the total down. Write the problems down too, in a file somebody can read
in the morning.

## What good looks like

```python
sum_takings([5, -2, 10], "run.log")     # 15
```

`run.log`, afterwards:

```
DEBUG: adding 5, running total 5
WARNING: skipping negative amount: -2
DEBUG: adding 10, running total 15
INFO: finished with total 15
```

## Your objective

**`sum_takings(amounts, log_path)`** — return the total of the non-negative
amounts, and write a log to `log_path` at `DEBUG` level with the format
`%(levelname)s: %(message)s`:

| When | Level | Message |
| --- | --- | --- |
| an amount is added | `DEBUG` | `adding 5, running total 5` |
| an amount is negative | `WARNING` | `skipping negative amount: -2` |
| at the end | `INFO` | `finished with total 15` |

Negative amounts are skipped and contribute nothing.

## Watch out for

**`force=True`** on `basicConfig`. Without it, the second call in the same
programme does nothing at all — logging is already configured, so your file is
never opened and your log is silently empty. It is one of the most baffling
half-hours in Python, and it costs one keyword to avoid.

The level matters: at the default level, `DEBUG` messages are thrown away.
