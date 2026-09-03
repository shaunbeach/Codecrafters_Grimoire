import requests

API_URL = "https://api.example.com/weather"


def fetch_weather(city):
    response = requests.get(API_URL, params={"city": city})
    if response.status_code != 200:
        return None

    data = response.json()
    location = data["location"]
    current = data["current"]
    return {
        "city": location["name"],
        "country": location["country"],
        "temp_c": current["temp_c"],
        "condition": current["condition"]["text"],
        "humidity": current["humidity"],
    }


def describe_weather(data):
    if data is None:
        return "Weather unavailable."
    return (
        f"{data['city']}, {data['country']}: {data['temp_c']}°C, "
        f"{data['condition']} ({data['humidity']}% humidity)"
    )
