import docx


def outline(path):
    headings = []
    for paragraph in docx.Document(path).paragraphs:
        text = paragraph.text.strip()
        if not text:
            continue
        name = paragraph.style.name
        if name == "Title":
            headings.append((0, text))
        elif name.startswith("Heading "):
            headings.append((int(name.split()[-1]), text))
    return headings
