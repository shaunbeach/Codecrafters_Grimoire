## The situation

The guild's messages go by runner, and runners get caught. The oldest fix in the
world is to shift every letter along the alphabet by an agreed amount — a trick
old enough that Caesar is supposed to have used it, and weak enough that you
should never use it for anything that matters.

It is, however, the perfect excuse to build your first lookup table.

## What good looks like

```python
build_cipher(3)["a"]              # 'd'
build_cipher(3)["z"]              # 'c'      it wraps

encode("attack at dawn!", 3)      # 'dwwdfn dw gdzq!'
decode("dwwdfn dw gdzq!", 3)      # 'attack at dawn!'
encode("hello", 0)                # 'hello'
```

## Your objective

**`build_cipher(shift)`** — return a dict with all 26 lowercase letters as keys,
each mapping to the letter `shift` places later, wrapping past `z`.

**`encode(text, shift)`** — return `text` with every lowercase letter shifted.
Spaces, punctuation, digits and capitals pass through untouched.

**`decode(text, shift)`** — undo `encode` with the same shift.

A shift of 26 — or 52 — must behave exactly like a shift of 0.

## Watch out for

`% 26` is what makes `z` wrap round to `c` rather than running off into
punctuation. It is also what makes a shift of 26 a no-op, and what makes
negative shifts work without a single extra line.

`.get(letter, letter)` is the neat way to leave everything that is not in the
table exactly as it was.

`decode` should not repeat `encode`'s logic. Think about what a negative shift
does.
