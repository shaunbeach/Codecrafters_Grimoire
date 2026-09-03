# A stand-in `requests` module again — this time serving the joke API. It is
# fussy about the Accept header, exactly like the real icanhazdadjoke.com.
import sys, types, json as _json, random
from urllib.parse import urlparse

JOKES = [
    {"id": "R7UfaahVfFd", "joke": "My dog used to chase people on a bike a lot. It got so bad I had to take his bike away."},
    {"id": "173political", "joke": "Did you hear about the guy who invented the knock-knock joke? He won the no-bell prize."},
    {"id": "0oO7wsG0FIld", "joke": "Why don't skeletons ever go trick or treating? Because they have nobody to go with."},
    {"id": "SvzOHb8ARnb", "joke": "I don't trust stairs. They're always up to something."},
]


class Response:
    def __init__(self, status_code, payload, text=None):
        self.status_code = status_code
        self._payload = payload
        self.text = text if text is not None else _json.dumps(payload)

    @property
    def ok(self):
        return self.status_code < 400

    def json(self):
        if self._payload is None:
            raise ValueError("Expecting value: line 1 column 1 (char 0)")
        return _json.loads(_json.dumps(self._payload))

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
    if "joke" not in (parsed.netloc + parsed.path):
        return Response(404, {"message": "Unknown endpoint."})

    accept = ""
    if headers:
        for key, value in headers.items():
            if key.lower() == "accept":
                accept = str(value).lower()

    if "application/json" not in accept:
        # The real API serves a plain-text joke when you do not ask for JSON.
        return Response(
            406,
            None,
            text="Not Acceptable: please set an Accept header of application/json",
        )

    return Response(200, dict(random.choice(JOKES), status=200))


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
