## The situation

There is a programme with no API, no command line and no export button. There is
only a window, a form, and a person who fills it in four hundred times a month.

You cannot ask that programme for anything. So you stop asking, and you pretend
to be the person.

> The hands here are phantom in the strictest sense: a browser tab cannot move
> your real mouse, and should not be able to. This grimoire supplies a stand-in
> that records every action rather than performing it — but the calls are the
> real ones, and this code would drive a real screen unchanged.

## What good looks like

```python
fill_form({"name": "Kira", "town": "Marrow Ford"}, "submit.png")
# 2
```

What the hands did:

```
write   'Kira'
press   tab
write   'Marrow Ford'
press   tab
locateCenterOnScreen  'submit.png'
click   (500, 400)
```

## Your objective

**`fill_form(fields, submit_image)`** — for each value in `fields`, in order:
type it with `pyautogui.write(...)`, then `pyautogui.press("tab")` to move to
the next box.

Then find the submit button with
`pyautogui.locateCenterOnScreen(submit_image)` and click it.

Return the number of fields filled in, as an `int`.

If the button cannot be found, raise `ValueError` with a message naming the
image, and **do not click anything**.

## Watch out for

`locateCenterOnScreen` returns `None` when it cannot find the image. Clicking
`None` is a `TypeError` from somewhere deep inside the library, which tells the
person reading the log nothing at all. Check it and raise something that names
the file.

The order matters and is observable. The checks read the recorded actions, so a
click before the last tab is a different sequence — and on a real screen it
would submit a half-filled form.
