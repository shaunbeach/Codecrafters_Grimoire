## The situation

The trial of the counting house. One region wants an invoice, and it should look
like something you would be willing to put your name to and send.

Nothing here is new. Read a ledger, filter it, conjure a fresh one, illuminate
it, and refuse politely when asked for something that does not exist. Five
workings, arriving together.

## What good looks like

`build_invoice('sales.xlsx', 'invoice.xlsx', 'North')` produces a leaf named
`Invoice`:

| | A | B | C | D |
| --- | --- | --- | --- | --- |
| **1** | INVOICE | | | |
| **2** | Region | North | | |
| **3** | Reference | INV-NORTH | | |
| **4** | | | | |
| **5** | Month | Units | Unit Price | Amount |
| **6** | January | 120 | 4.5 | 540.0 |
| **7** | February | 95 | 4.5 | 427.5 |
| **8** | TOTAL | | | 967.5 |

```python
build_invoice('sales.xlsx', 'invoice.xlsx', 'North')
# 967.5
```

## Your objective

**`build_invoice(source, destination, region)`** —

- `A1` is `INVOICE`, bold and size 14
- `A2`/`B2` are `Region` and the region name; `A3`/`B3` are `Reference` and
  `INV-` followed by the region in capitals
- row 4 is left empty
- row 5 is the bold header `Month`, `Units`, `Unit Price`, `Amount`
- one row per month for that region, in the order the source lists them
- an empty `Units` cell counts as `0`
- a final row with `TOTAL` in column A and the sum in column D
- the sheet is named `Invoice`
- return the total as a `float`

If the region has no rows at all, raise `ValueError` with a message naming it.

## Watch out for

The blank row 4 is not decoration either — it means your header sits at row 5
and your first line item at row 6. An off-by-one here is the likeliest way this
goes wrong, and the Files tab will show you the moment it does.
