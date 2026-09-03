Three moves in a row: break the text into words, fix each word, put them back
together. Try printing the result of the first move before you write the second.
---
`text.split()` with **no argument** collapses runs of spaces and drops the empty
pieces — different from `text.split(" ")`, which keeps them.

`" ".join(words)` puts a list of words back into one string with single spaces.
---
```python
words = text.split()
return " ".join(word.capitalize() for word in words)
```

An empty list joins to an empty string, so the last case needs no special
handling at all.
