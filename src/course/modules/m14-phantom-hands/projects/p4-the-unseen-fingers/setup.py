# A screen with a submit button on it, for the phantom hands to find.
import pyautogui

pyautogui.reset(width=1920, height=1080, fixtures={"submit.png": (500, 400)})
