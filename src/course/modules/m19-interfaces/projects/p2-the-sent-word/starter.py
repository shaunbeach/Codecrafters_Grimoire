import os
import smtplib
from email.message import EmailMessage

SENDER = "guild@example.com"


def send_report(server, to, subject, body):
    # your code here
    pass


if __name__ == "__main__":
    os.environ["GUILD_MAIL_PASSWORD"] = "not-a-real-password"
    print(send_report("smtp.example.com", "kira@example.com",
                      "Quarterly review", "Sales rose in the North."))
    print(SENT[-1])
