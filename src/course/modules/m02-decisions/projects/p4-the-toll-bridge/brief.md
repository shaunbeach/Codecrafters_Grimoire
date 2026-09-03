## The situation

The bridge at Marrow Ford charges by age, and the guild negotiated a discount
years ago that the tollkeeper keeps forgetting to apply.

## What good looks like

```python
toll(8, False)       # 0.0
toll(30, False)      # 5.0
toll(30, True)       # 4.0
toll(70, False)      # 2.5
toll(70, True)       # 2.0
```

## Your objective

**`toll(age, is_guild_member)`** — return the fare as a `float`.

The bands:

| Age | Fare |
| --- | --- |
| under 12 | free — `0.0` |
| 12 to 64 | `5.0` |
| 65 and over | `2.5` |

Then, if the traveller is a guild member, take **20% off** the fare and round
the result to 2 decimal places.

A free crossing stays free; twenty per cent of nothing is nothing.

## Watch out for

Work out the band first, then apply the discount to whatever it produced. If you
try to write a branch for every combination of age and membership you will need
six of them, and you will get one wrong.

`round(4.0, 2)` is `4.0`. Rounding a number that needs no rounding is harmless,
so you can apply it unconditionally rather than testing whether you need it.
