An accumulator and a loop over pairs. `for question, answer in questions:`
unpacks each tuple as it goes.
---
Print the question, then `given = input("> ")`.

The comparison: `given.strip().lower() == answer.strip().lower()`.

Score inside the loop, report after it, return last.
---
```python
score = 0
for question, answer in questions:
    print(question)
    given = input("> ")
    if given.strip().lower() == answer.strip().lower():
        print("Correct!")
        score += 1
    else:
        print(f"Wrong — the answer was {answer}.")
print(f"You scored {score}/{len(questions)}.")
return score
```
