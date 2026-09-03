Gather the matching rows first, and check the list is not empty. Everything
after that is writing cells in order, top to bottom — and if you add the blank
row too, `append()` will place every one of them for you.
---
`sheet.append([])` adds an empty row, which spares you tracking row numbers by
hand: three heading rows, then the blank, then the header, then the line items,
then the total.

Refuse before you build anything, not halfway through:
`raise ValueError(f"No sales for {region}")`.
---
```python
rows = [r for r in sheet.iter_rows(min_row=2, values_only=True) if r[0] == region]
if not rows:
    raise ValueError(f'No sales for {region}')

out.append(['INVOICE'])
out.append(['Region', region])
out.append(['Reference', f'INV-{region.upper()}'])
out.append([])
out.append(['Month', 'Units', 'Unit Price', 'Amount'])

total = 0.0
for _region, month, units, price in rows:
    units = units or 0
    amount = units * price
    total += amount
    out.append([month, units, price, amount])

out.append(['TOTAL', None, None, total])
```
