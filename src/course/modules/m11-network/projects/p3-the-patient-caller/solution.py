import time

import requests


def fetch_with_retry(url, attempts=3):
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
