## The situation

There is a machine somewhere that knows what the weather is doing in London. You
have never seen it, you do not know who runs it, and it is going to tell you in
under a second.

Stop and notice that before you write the code. It stops being remarkable very
quickly, and it should not.

The endpoint is `https://api.example.com/weather`, taking one parameter, `city`.
It knows **London**, **Tokyo** and **Reykjavik**. Anything else is a 404.

## What good looks like

```python
fetch_weather("London")
# {'city': 'London', 'country': 'United Kingdom',
#  'temp_c': 12.5, 'condition': 'Light rain', 'humidity': 82}

fetch_weather("Atlantis")     # None

describe_weather(fetch_weather("London"))
# 'London, United Kingdom: 12.5°C, Light rain (82% humidity)'
```

What the service actually sends:

```json
{
  "location": {"name": "London", "country": "United Kingdom"},
  "current": {"temp_c": 12.5, "humidity": 82,
              "condition": {"text": "Light rain"}}
}
```

## Your objective

**`fetch_weather(city)`** — call the service and return the flat dictionary
above. Return `None` if the status is anything other than 200.

**`describe_weather(data)`** — one readable line. Given `None`, return
`'Weather unavailable.'`

## Watch out for

Check `response.status_code` **before** calling `.json()`. A 404 body is an
error message with entirely different keys, and parsing it gives you a
dictionary that looks healthy right up until something downstream breaks.

`condition` is nested one level deeper than the rest:
`data["current"]["condition"]["text"]`.
