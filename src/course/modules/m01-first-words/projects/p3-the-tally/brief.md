## The situation

Four adventurers, one long evening, and a bill nobody wants to work out. The
landlord has seen this end badly before and would like it settled in writing.

## What good looks like

```python
split_bill(100, 15, 4)
```

```
Bill: $100.00 + 15% tip ($15.00) = $115.00
Split 4 ways: $28.75 each
```

## Your objective

**`split_bill(total, tip_percent, people)`** — return that two-line string.

- the tip is `total * tip_percent / 100`
- each share is the grand total divided by `people`
- **every money amount is formatted to exactly two decimal places**
- the two lines are joined by a single `\n`, with nothing on the end

## Watch out for

`0.1 + 0.2` is `0.30000000000000004`. Your arithmetic will produce numbers with
long ugly tails, and that is normal — `:.2f` in an f-string both rounds them and
pads them, so `5` becomes `5.00` rather than `5`.

The percentage is written plainly: `15%`, not `15.00%`.
