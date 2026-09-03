# A question bank, already saved to disk for you.
import os

os.makedirs("/data", exist_ok=True)

with open("/data/questions.txt", "w") as handle:
    handle.write(
        "What is the capital of France?|Paris\n"
        "What is 2 + 2?|4\n"
        "Which keyword defines a function in Python?|def\n"
        "What does CSV stand for?|comma separated values\n"
    )

with open("/data/messy.txt", "w") as handle:
    handle.write(
        "Good question?|Yes\n"
        "\n"
        "a line with no separator\n"
        "   \n"
        "Another good one?|Also yes\n"
    )
