from pypdf import PdfReader, PdfWriter


def extract_pages(source, destination, pages):
    reader = PdfReader(source)
    writer = PdfWriter()

    written = 0
    for number in pages:
        if 0 <= number < len(reader.pages):
            writer.add_page(reader.pages[number])
            written += 1

    with open(destination, "wb") as handle:
        writer.write(handle)
    return written
