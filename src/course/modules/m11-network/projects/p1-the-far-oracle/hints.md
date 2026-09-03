Make the call and print `response.status_code` and `response.json()` before you
try to flatten anything. Seeing the real shape first saves guessing.
---
`requests.get(API_URL, params={"city": city})` — `params` is what puts the city
into the query string safely.

Guard the status, then pull the two nested dictionaries out into names of their
own before building the flat one. It reads far better than four levels of
brackets on one line.
---
```python
response = requests.get(API_URL, params={"city": city})
if response.status_code != 200:
    return None

data = response.json()
location, current = data["location"], data["current"]
return {
    "city": location["name"],
    "country": location["country"],
    "temp_c": current["temp_c"],
    "condition": current["condition"]["text"],
    "humidity": current["humidity"],
}
```
