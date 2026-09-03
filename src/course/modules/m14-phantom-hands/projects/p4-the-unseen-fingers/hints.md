Loop over `fields.values()`, and do two things per value: write it, then tab.
Count as you go.
---
After the loop, one call to find the button, one guard, one click.

`pyautogui.click(spot)` accepts the `(x, y)` pair `locateCenterOnScreen` hands
back — you do not need to unpack it.
---
```python
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
```
