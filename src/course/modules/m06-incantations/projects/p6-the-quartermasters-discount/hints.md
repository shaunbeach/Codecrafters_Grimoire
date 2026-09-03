Two steps in order: take the discount off, then add the tax to whatever is left.
Give the middle value a name so you can print it and check it.
---
Ten per cent off means you keep ninety per cent:
`base * (1 - discount_percent / 100)`.

Adding five per cent tax means multiplying by `1 + tax_rate`.

`round(value, 2)` at the end.
---
```python
def price(base, discount_percent=0, tax_rate=0.05):
    discounted = base * (1 - discount_percent / 100)
    return round(discounted * (1 + tax_rate), 2)
```
