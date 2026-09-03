def run_quiz(questions):
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

