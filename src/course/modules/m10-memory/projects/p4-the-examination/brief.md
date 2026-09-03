## The situation

**Step 2 of 2 — The Examination.**

`load_questions` is already here. Now sit the candidate down.

Press **Run** and it will examine *you* — it genuinely waits for your answers.

## What good looks like

```
What is the capital of France?
> Paris
Correct!
What is 2 + 2?
> 5
Wrong — the answer was 4.
You scored 1/2.
```

```python
run_quiz(questions)     # 1
```

## Your objective

**`run_quiz(questions)`** — for each question, in order:

1. show the question text (print it, or use it as the `input()` prompt)
2. read the answer with `input()`
3. print exactly `Correct!` or `Wrong — the answer was <answer>.`

Then print `You scored <score>/<total>.` and **return** the score as an `int`.

Comparison ignores case and surrounding whitespace. An empty quiz scores 0 and
must not crash.

## Watch out for

Strip and lower **both** sides of the comparison, not just the candidate's
answer. A trailing space in your own question file would otherwise fail a
correct answer, and you would blame the candidate.

`len(questions)` of an empty list is 0, and printing `0/0` is fine — but any
percentage you calculate from it is a `ZeroDivisionError`.

Note the em dash in `Wrong — the answer was`. The check compares exactly.
