def load_questions(path):
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
