Build the top line first and give it a name of its own. Once it exists as a
variable, the rule is one short expression away, because you can measure the
thing you just made.
---
`"=" * 8` gives you eight equals signs, and `len(top)` gives you the 8 without
you having to count.

Two lines joined by a newline is `top + "\n" + rule`.
---
```python
top = "~ " + name + " ~"
rule = "=" * len(top)
return top + "\n" + rule
```

Note there is no `\n` after `rule` — the sign is two lines, not two lines and an
empty one.
