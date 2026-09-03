# The Counting House

You did not come all this way for this.

You went into the dark to learn loops. You sat with dictionaries until they made
sense. You wrote classes that held their own shape, and files that outlived the
program that made them. And now the road brings you here — to an office, on a
Tuesday, where somebody is opening a spreadsheet.

Stay. This is the part that matters.

There is a workbook on that machine with four thousand rows in it. Once a month
a person opens it and does the same small thing to every row, by hand, for two
days. They do not know it can be otherwise. **You** know it can be otherwise.
That is the whole of the elixir, and this is where you pour it out.

## The grand ledger

An `.xlsx` file is not text. Open one in an editor and you get a wall of noise —
it is a zip archive full of XML, sealed against casual reading. That sealing is
why the person with four thousand rows does them by hand: the ledger looks like
something only the machine that made it may touch.

It is not. It only needs the right lens.

```
pip install openpyxl
```

That is the incantation. One line, and the seal is off.

## Opening the book

```python
from openpyxl import load_workbook

book = load_workbook('sales.xlsx')
```

A **workbook** is the file itself. Inside it are **worksheets** — the tabs along
the bottom. Reach them by name, or take whichever was open last:

```python
book.sheetnames          # ['Sales', 'Notes']
sheet = book['Sales']
sheet = book.active
```

## Cells, and the two countings

Every cell has a coordinate you already know from using a spreadsheet: a column
letter and a row number.

```python
sheet['A1'].value        # 'Region'
sheet['B2'].value        # 'January'
sheet.cell(row=2, column=2).value    # the same cell, addressed by number
```

Note `.value` on the end. `sheet['A1']` hands you the *cell* — an object with a
font, a border, a fill and a value. It is the value you almost always want.

Now the one thing in this module that will bite you, so learn it before it does.
Two counting systems sit side by side here, and they do not agree:

| | Starts at | So |
| --- | --- | --- |
| Spreadsheet rows and columns | **1** | `sheet.cell(row=1, column=1)` is `A1` |
| Python lists | **0** | `rows[0]` is the first row |

Row 1 is usually the header. Your data therefore starts at **row 2**, and
`range(2, sheet.max_row + 1)` is the loop you will write over and over.

```python
sheet.max_row       # 9
sheet.max_column    # 4
```

## Column sigils

Column 27 is `AA`, not `Z1`. Do not work this out by hand:

```python
from openpyxl.utils import get_column_letter, column_index_from_string

get_column_letter(1)              # 'A'
get_column_letter(27)             # 'AA'
column_index_from_string('D')     # 4
```

## Walking the rows

The loop you want gives you each row as a plain tuple:

```python
for row in sheet.iter_rows(values_only=True):
    print(row)
```

```
('Region', 'Month', 'Units', 'Unit Price')
('North', 'January', 120, 4.5)
('South', 'January', 80, 4.5)
```

The header arrives as the first row like any other. Skip it at the source rather
than slicing afterwards — it is clearer, and it does less work:

```python
for row in sheet.iter_rows(min_row=2, values_only=True):
    ...
```

## Giving the columns their names

`row[2]` makes the reader remember what column 2 was. Names are better, and you
already know this pattern from CSV:

```python
rows = list(sheet.iter_rows(values_only=True))
headers = rows[0]

records = [dict(zip(headers, row)) for row in rows[1:]]
records[0]['Units']        # 120
```

## Empty is not zero

A blank cell reads back as `None`. `None * 4.5` raises `TypeError`, and it will
do so on row 3,847 of four thousand, an hour into the run. Guard it:

```python
units = row['Units'] or 0
```

That `or 0` catches the empty string too, which is usually what a spreadsheet
means by blank.

## Transmutation

Here is the turn. Reading a ledger is scholarship. **Changing** one is the work.

```python
sheet['E1'] = 'Total'
sheet.cell(row=2, column=5, value=540.0)
book.save('sales.xlsx')
```

Assigning to a cell changes it **in memory only**. Nothing reaches the disk
until `save()`. Three warnings, each of which has cost somebody an afternoon:

- **`save()` rewrites the whole file.** Saving over the original edits in place;
  saving to a new name leaves the original untouched. Decide which you meant
  before you type the path, not after.
- **openpyxl does not recalculate formulas.** It is not Excel. Write
  `=SUM(A1:A9)` and the *string* is stored; read it back with `data_only=True`
  and you get `None` until Excel has opened the file and worked it out. If you
  want a number in the cell, compute it in Python and write the number.
- **`load_workbook(path, data_only=True)`** gives you the last value Excel
  cached for a formula rather than the formula itself. Which you want depends on
  whether you are reading results or editing structure.

## Making one from nothing

```python
from openpyxl import Workbook

book = Workbook()
sheet = book.active
sheet.title = 'Summary'

sheet.append(['Region', 'Revenue'])
sheet.append(['North', 540.0])

book.save('summary.xlsx')
```

`Workbook()` arrives with one sheet already made — rename it rather than adding
a second, or you will ship a report with an empty tab called *Sheet* in it.
`append()` adds a row at the bottom and spares you counting rows yourself.

## A little illumination

```python
from openpyxl.styles import Font, Alignment

sheet['A1'].font = Font(bold=True, size=12)
sheet['B2'].alignment = Alignment(horizontal='right')
sheet.column_dimensions['A'].width = 18
```

Enough to make something a person will actually read, which is the difference
between a script and a tool.

## What you will build here

Six workings. Three of them are one job in three parts — open a sales ledger,
transmute a computed column into it, and draw a summary out of the result — then
an audit that stops and asks you what it should do, and finally an invoice
conjured from nothing at all.

Every line of it runs unchanged against a real workbook on a real machine. That
is not a simulation of the elixir. It is the elixir.
