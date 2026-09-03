import docx


def outline(path):
    # your code here
    pass


if __name__ == "__main__":
    for level, text in outline("/workspace/report.docx"):
        print("  " * level + text)
