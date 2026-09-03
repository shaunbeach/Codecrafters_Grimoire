## The situation

Most sales at the quartermaster's window are ordinary: no discount, the usual
tax. Occasionally there is a guild rate, and once a year the tax changes.

A working that forces you to state all three every time will be got wrong. A
working with sensible defaults will not.

## What good looks like

```python
price(100)                              # 105.0
price(100, 10)                          # 94.5
price(100, discount_percent=10)         # 94.5
price(100, 0, 0.2)                      # 120.0
price(100, tax_rate=0)                  # 100.0
```

## Your objective

**`price(base, discount_percent=0, tax_rate=0.05)`** — return what is owed, as a
`float` rounded to 2 decimal places.

Take the discount off the base first, then add the tax to what remains. Order
matters: tax is charged on the discounted price, not the original.

## Watch out for

`price(100)` must work with one argument. That is what the defaults are for, and
it is the call that will be made a hundred times a day.

A discount of 10 means ten **per cent**, not ten coins.

Parameters with defaults must come after those without — `base` has no sensible
default, so it goes first.
