# A roster, exported from a spreadsheet the way real ones arrive.
import os

os.makedirs("/data", exist_ok=True)


def reset_roster():
    with open("/data/roster.csv", "w", newline="") as handle:
        handle.write(
            "name,level,town\n"
            "Kira,7,Marrow Ford\n"
            "Bo,3,Ashwell\n"
            "Ana,12,Marrow Ford\n"
        )


reset_roster()
