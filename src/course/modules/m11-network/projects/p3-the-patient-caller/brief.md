## The situation

Services fail for a second and then work again. A connection resets. A machine
somewhere is restarting. The single most useful thing you can add to a network
call is the willingness to try once more.

The single most **antisocial** thing you can add is trying once more
immediately, forever.

## What good looks like

```python
fetch_with_retry("https://api.example.com/weather?city=London", attempts=3)
# {'attempts': 1, 'ok': True, 'data': {...}}      worked first time

# a service that fails twice then recovers:
# {'attempts': 3, 'ok': True, 'data': {...}}

# a service that never recovers:
# {'attempts': 3, 'ok': False, 'data': None}
```

## Your objective

**`fetch_with_retry(url, attempts=3)`** — call `requests.get(url, timeout=5)`,
retrying on failure, and return a dict with:

- `attempts` — how many calls were actually made
- `ok` — whether one of them succeeded (status 200)
- `data` — the parsed JSON from the successful call, or `None`

A call counts as failed if `requests` raises **or** the status is not 200.

Between attempts, wait — call `time.sleep(delay)` with the delay **doubling**
each time: 1 second, then 2, then 4. Do not sleep after the last attempt; there
is nothing left to wait for.

## Watch out for

That doubling is called **exponential backoff**, and it is the difference
between a client that helps a struggling service recover and one that finishes
it off. Every serious network library does this.

Do not sleep after the final failure. It achieves nothing and makes your
programme slower for no reason — a small thing that reviewers always notice.

The checks replace `time.sleep` so this runs instantly; they do inspect what you
asked it to wait for.
