import os
import smtplib
from email.message import EmailMessage

SENDER = "guild@example.com"


def send_report(server, to, subject, body):
    password = os.environ.get("GUILD_MAIL_PASSWORD")
    if not password:
        raise RuntimeError("GUILD_MAIL_PASSWORD is not set")

    message = EmailMessage()
    message["From"] = SENDER
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    with smtplib.SMTP(server, 587) as connection:
        connection.starttls()
        connection.login(SENDER, password)
        connection.send_message(message)

    return True
