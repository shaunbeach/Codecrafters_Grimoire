# parse_csv is already here, from the previous working.


def class_average(rows, column):
    # your code here
    pass


def top_student(rows):
    # your code here
    pass


if __name__ == "__main__":
    rows = parse_csv("/data/grades.csv")
    print(class_average(rows, "maths"), top_student(rows))
