import pyautogui


def fill_form(fields, submit_image):
    filled = 0
    for value in fields.values():
        pyautogui.write(value)
        pyautogui.press("tab")
        filled += 1

    spot = pyautogui.locateCenterOnScreen(submit_image)
    if spot is None:
        raise ValueError(f"could not find {submit_image} on screen")

    pyautogui.click(spot)
    return filled
