## The situation

The quarterly review is written. Now it has to reach forty people who will never
open a terminal.

> Nothing here can send real mail from a browser tab. The mail server is a
> stand-in that records every message instead of delivering it — but the code is
> the code that would send it.

## What good looks like

```python
send_report("smtp.example.com", "kira@example.com",
            "Quarterly review", "Sales rose in the North.")
# True
```

What the server saw:

```python
{'from': 'guild@example.com', 'to': 'kira@example.com',
 'subject': 'Quarterly review', 'body': 'Sales rose in the North.\n',
 'tls': True, 'user': 'guild@example.com'}
```

## Your objective

**`send_report(server, to, subject, body)`** — compose an `EmailMessage` with
`From` set to `guild@example.com`, the given `To`, `Subject` and body, then:

1. connect with `smtplib.SMTP(server, 587)`
2. call `starttls()`
3. `login(...)` with the address and the password from the environment variable
   `GUILD_MAIL_PASSWORD`
4. send it, and return `True`

If that environment variable is not set, raise `RuntimeError` naming it, and
**do not connect at all**.

## Watch out for

`starttls()` before `login()`, always. Without it your password crosses the
network in the clear, and the order is not something the library will warn you
about.

The password comes from `os.environ`, never from your source. Code gets
committed; the internet has robots that do nothing but look through commits for
credentials.

Refuse *before* connecting. Opening a connection you cannot authenticate is
noise in somebody else's logs.
