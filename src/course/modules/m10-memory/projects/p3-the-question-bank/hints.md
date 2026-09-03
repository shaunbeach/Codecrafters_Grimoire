Same shape as the habit stone: open in a `try`, split into lines, skip what you
cannot read, and collect what you can.
---
`line.partition("|")` gives you `(question, separator, answer)`. When the pipe is
missing the middle is empty — which is how you know to skip.

Append a tuple: `questions.append((question.strip(), answer.strip()))`.
---
```python
try:
    with open(path) as handle:
        text = handle.read()
except FileNotFoundError:
    return []

questions = []
for line in text.splitlines():
    line = line.strip()
    if not line or "|" not in line:
        continue
    question, _, answer = line.partition("|")
    questions.append((question.strip(), answer.strip()))
return questions
```
