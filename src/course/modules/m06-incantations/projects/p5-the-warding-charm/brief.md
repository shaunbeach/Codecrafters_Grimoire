## The situation

A ward is only as strong as the phrase that seals it, and apprentices keep
sealing vaults with the word `dragon`.

The guild wrote rules. What it did not write was anything explaining *which*
rule you broke, so every rejected apprentice comes back to ask. Your working
should say.

## What good looks like

```python
ward_strength("Th1s is str0ng")     # 'ACCEPTED'
ward_strength("short1A")            # 'too short'
ward_strength("alllowercase1")      # 'needs a capital'
ward_strength("ALLUPPERCASE1")      # 'needs a lowercase letter'
ward_strength("NoDigitsInHere")     # 'needs a digit'
```

## Your objective

**`ward_strength(phrase)`** — return the **first** reason the phrase fails, or
`'ACCEPTED'` when it passes everything.

The rules, checked in this order:

1. at least 12 characters — `'too short'`
2. at least one capital letter — `'needs a capital'`
3. at least one lowercase letter — `'needs a lowercase letter'`
4. at least one digit — `'needs a digit'`

## Watch out for

Order is part of the specification. `"short1"` is both too short and missing a
capital; the caller is told about the length, because that is the rule listed
first.

Four guard clauses in a row, each returning immediately, and `'ACCEPTED'` alone
at the bottom. Do not build up a list of failures — the brief asks for the
first.

`any(c.isupper() for c in phrase)` asks whether **any** character is a capital.
`.isupper()` on the whole string asks whether *all* of them are, which is a
different question and the usual way this goes wrong.
