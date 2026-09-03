Two halves: build the message, then send it. Check for the password before
either.
---
```python
password = os.environ.get("GUILD_MAIL_PASSWORD")
if not password:
    raise RuntimeError("GUILD_MAIL_PASSWORD is not set")
```

An `EmailMessage` takes its headers by assignment — `message["To"] = to` — and
its body from `set_content(body)`.

Then `with smtplib.SMTP(server, 587) as connection:` and the three calls in
order.
---
```python
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
```
