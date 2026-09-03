Two lookups, one inside the other, and each has its own failure. Do the first
one, check it, and only then do the second.
---
`roster.get(name)` gives you the page or `None`. If it is `None`, you already
have your answer and can return.

Once you know the page exists, `page.get(field, 'unrecorded')` handles the
second case in one go.
---
```python
page = roster.get(name)
if page is None:
    return "no such member"
return page.get(field, "unrecorded")
```

Note the guard clause again: deal with the awkward case, return, and let the
ordinary case sit flat at the bottom.
