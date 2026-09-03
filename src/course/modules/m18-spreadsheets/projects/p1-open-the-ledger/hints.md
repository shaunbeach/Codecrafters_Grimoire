Everything begins with `load_workbook(path)`. Once the book is open, both
answers are one attribute or one index away. No loop is needed here — you are
not walking the ledger yet, only looking at it.
---
The titles are already a list: `book.sheetnames`, in tab order, no work
required.

For the single cell, `book[sheet]` gets you the leaf and `worksheet[ref]` gets
you the cell — but a cell is an object with a font and a border and a fill. What
you were asked for is on `.value`.
---
```python
book = load_workbook(path)
return book.sheetnames
```

and for the cell, note where the working actually ends:

```python
return book[sheet][ref].value
```
