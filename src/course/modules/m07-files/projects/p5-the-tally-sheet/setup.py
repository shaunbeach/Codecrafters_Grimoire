# Drops a small gradebook onto the virtual filesystem for you to parse.
import os

os.makedirs("/data", exist_ok=True)

with open("/data/grades.csv", "w") as handle:
    handle.write(
        "name,maths,science,history\n"
        "Kira,88,92,79\n"
        "Bo,71,65,80\n"
        "Ana,95,99,91\n"
        "Rex,60,72,58\n"
    )

with open("/data/tiny.csv", "w") as handle:
    handle.write("name,score\nSolo,42\n")
