Work out the three numbers first — tip, grand total, each share — and give each
one a name. Print them raw and look at the tails. Only then think about
formatting.
---
Every money value needs `:.2f` inside its braces. In an f-string that looks like
`f"${tip:.2f}"`, which is a dollar sign, then the value, then the format.

The tip percentage is not money, so it goes in plain: `{tip_percent}%`.
---
```python
tip = total * tip_percent / 100
grand_total = total + tip
share = grand_total / people

line_one = f"Bill: ${total:.2f} + {tip_percent}% tip (${tip:.2f}) = ${grand_total:.2f}"
line_two = f"Split {people} ways: ${share:.2f} each"
return line_one + "\n" + line_two
```
