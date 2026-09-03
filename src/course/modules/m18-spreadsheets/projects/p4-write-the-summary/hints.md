Two halves that barely touch: add the figures up into a dictionary keyed by
region, then write that dictionary out as a new book. Get the first half
printing correctly before you write a single cell.
---
`totals.setdefault(region, [0, 0.0])` hands you a units-and-revenue pair to add
into, creating it the first time a region is seen.

`Workbook()` already contains one leaf — rename it with
`sheet.title = 'Summary'` rather than creating a second, or the report ships
with an empty tab called *Sheet*.

Bold is `sheet['A1'].font = Font(bold=True)`, one cell at a time.
---
```python
for region in sorted(totals):
    units, revenue = totals[region]
    sheet.append([region, units, revenue])

sheet.append(['TOTAL', sum(u for u, _ in totals.values()),
              sum(r for _, r in totals.values())])

for cell in sheet[1]:
    cell.font = Font(bold=True)

book.save(destination)
return {region: revenue for region, (units, revenue) in totals.items()}
```
