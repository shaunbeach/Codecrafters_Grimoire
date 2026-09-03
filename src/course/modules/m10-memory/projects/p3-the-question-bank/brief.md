## The situation

**Step 1 of 2 — The Examination.**

The guild examiner has a hundred questions and would like a hundred more next
month. They are not going to be in your code.

`/data/questions.txt`:

```
What is the capital of France?|Paris
What is 2 + 2?|4
Which keyword defines a function in Python?|def
```

## What good looks like

```python
questions = load_questions("/data/questions.txt")

len(questions)   # 4
questions[0]     # ('What is the capital of France?', 'Paris')
```

## Your objective

**`load_questions(path)`** — return a list of `(question, answer)` tuples.

Skip blank lines and any line without a `|`. A missing file gives `[]`.

## Watch out for

Why a pipe rather than a comma? Because questions contain commas, and answers
might. Choosing a separator your data cannot hold is a real decision, and the
wrong choice here has quietly corrupted more data files than any other mistake
in computing.

Strip both halves. A stray space in the answer column is invisible in an editor
and will fail every comparison in the next step.
