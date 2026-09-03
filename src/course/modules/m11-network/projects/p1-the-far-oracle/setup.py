# Your browser cannot make real network calls from inside this sandbox, so a
# stand-in `requests` module is installed here. It has the same API as the real
# library — everything you write today would work unchanged against the real
# internet.
import sys, types, json as _json
from urllib.parse import urlparse, parse_qs

_FORECASTS = {
    "london": {
        "location": {"name": "London", "country": "United Kingdom"},
        "current": {
            "temp_c": 12.5,
            "humidity": 82,
            "wind_kph": 14.0,
            "condition": {"text": "Light rain"},
        },
    },
    "tokyo": {
        "location": {"name": "Tokyo", "country": "Japan"},
        "current": {
            "temp_c": 26.0,
            "humidity": 60,
            "wind_kph": 8.0,
            "condition": {"text": "Sunny"},
        },
    },
    "reykjavik": {
        "location": {"name": "Reykjavik", "country": "Iceland"},
        "current": {
            "temp_c": -3.0,
            "humidity": 91,
            "wind_kph": 42.5,
            "condition": {"text": "Blowing snow"},
        },
    },
}


class Response:
    def __init__(self, status_code, payload):
        self.status_code = status_code
        self._payload = payload
        self.text = _json.dumps(payload)
        self.encoding = "utf-8"

    @property
    def ok(self):
        return self.status_code < 400

    def json(self):
        return _json.loads(self.text)

    def raise_for_status(self):
        if not self.ok:
            raise HTTPError(f"{self.status_code} Client Error for url")

    def __repr__(self):
        return f"<Response [{self.status_code}]>"


class RequestException(Exception):
    pass


class HTTPError(RequestException):
    pass


class Timeout(RequestException):
    pass


def get(url, params=None, headers=None, timeout=None):
    parsed = urlparse(str(url))
    if "weather" not in parsed.path and "weather" not in parsed.netloc:
        return Response(404, {"error": {"message": "Unknown endpoint."}})

    query = parse_qs(parsed.query)
    city = None
    if params:
        city = params.get("city") or params.get("q")
    if city is None and query:
        found = query.get("city") or query.get("q")
        city = found[0] if found else None

    if not city:
        return Response(400, {"error": {"message": "No city supplied."}})

    forecast = _FORECASTS.get(str(city).strip().lower())
    if forecast is None:
        return Response(404, {"error": {"message": "No matching location found."}})
    return Response(200, forecast)


_module = types.ModuleType("requests")
_module.get = get
_module.Response = Response
_module.RequestException = RequestException
_module.HTTPError = HTTPError
_module.Timeout = Timeout
_module.exceptions = types.SimpleNamespace(
    RequestException=RequestException, HTTPError=HTTPError, Timeout=Timeout
)
sys.modules["requests"] = _module
