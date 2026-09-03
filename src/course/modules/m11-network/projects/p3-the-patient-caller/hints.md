A loop over the attempts, with a `try` inside it. Success returns straight away;
failure falls through to the sleep and goes round again.
---
Track the delay in a variable starting at 1 and double it each time round.

`for attempt in range(1, attempts + 1)` gives you the count for the return
value. Sleep only when `attempt < attempts`.
---
```python
delay = 1
for attempt in range(1, attempts + 1):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return {"attempts": attempt, "ok": True, "data": response.json()}
    except requests.RequestException:
        pass

    if attempt < attempts:
        time.sleep(delay)
        delay *= 2

return {"attempts": attempts, "ok": False, "data": None}
```
