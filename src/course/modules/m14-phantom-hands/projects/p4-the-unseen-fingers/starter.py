import pyautogui


def fill_form(fields, submit_image):
    # your code here
    pass


if __name__ == "__main__":
    print(fill_form({"name": "Kira", "town": "Marrow Ford"}, "submit.png"))
    for event in pyautogui.EVENTS:
        print(event["action"], event)
