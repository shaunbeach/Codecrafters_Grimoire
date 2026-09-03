# A stand-in mail server. Nothing leaves the room; every message is recorded.
import smtplib

SENT = []


class _Recorder:
    def __init__(self, host, port=0, **kwargs):
        self.host, self.port = host, port
        self.tls = False
        self.user = None

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def starttls(self, *args, **kwargs):
        self.tls = True

    def login(self, user, password):
        self.user = user
        self.password = password

    def send_message(self, message):
        SENT.append(
            {
                "from": message["From"],
                "to": message["To"],
                "subject": message["Subject"],
                "body": message.get_content(),
                "tls": self.tls,
                "user": self.user,
            }
        )

    def quit(self):
        pass


smtplib.SMTP = _Recorder


def reset_outbox():
    SENT.clear()
