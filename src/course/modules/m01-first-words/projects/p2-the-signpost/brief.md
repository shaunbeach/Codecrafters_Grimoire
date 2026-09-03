## The situation

The banner you painted said one thing to one door. The guild wants signposts —
dozens of them, one per name, all in the same hand.

So this working does not shout. It **makes** a sign and hands it over, and
somebody else decides where to hang it. That difference between saying and
making is the first real idea in this grimoire.

## What good looks like

```python
build_sign("Kira")
```

```
~ Kira ~
========
```

```python
build_sign("Bo")
```

```
~ Bo ~
======
```

## Your objective

**`build_sign(name)`** — **return** a two-line string:

- line 1 is the name wrapped in tildes and spaces: `~ Kira ~`
- line 2 is a row of `=` exactly as long as line 1

The two lines are joined by a single `\n`, with no newline on the end.

## Watch out for

The rule has to measure itself against the line above. Count the characters in
`~ Kira ~` — eight, not four. `len()` on the finished line, not on the name.

Return it. Do not print it. A check that asks for a value and receives `None`
will tell you exactly this, and it is the most common way this one goes wrong.
