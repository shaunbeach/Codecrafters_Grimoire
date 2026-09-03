## The situation

An old rule, scratched into a workbench: take a number. If it is even, halve it.
If it is odd, treble it and add one. Repeat.

Every number anyone has ever tried eventually falls to 1. **Nobody has proved
that it always will.** It is one of the shortest unsolved problems in
mathematics, and you can write it in six lines.

## What good looks like

```python
hailstone(6)
# [6, 3, 10, 5, 16, 8, 4, 2, 1]

hailstone(1)
# [1]

hailstone(7)[:5]
# [7, 22, 11, 34, 17]
```

## Your objective

**`hailstone(n)`** — return the whole path as a list of integers, starting with
`n` and ending with `1`.

- even numbers are halved
- odd numbers become `3 * n + 1`
- the list always includes both the number you started from and the final `1`

## Watch out for

Use `//` for halving, not `/`. Plain division gives you `3.0` where you want
`3`, and a list of floats will not match.

`hailstone(1)` is `[1]` — the loop body never runs, because you are already
there. Start the list with `n` in it, before the loop, and that case handles
itself.
