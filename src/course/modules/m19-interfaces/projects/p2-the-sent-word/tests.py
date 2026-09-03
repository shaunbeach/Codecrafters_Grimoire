import os


def _with_password():
    os.environ["GUILD_MAIL_PASSWORD"] = "correct-horse"


def test_sends_a_message():
    """One message reaches the server"""
    send_report = require("send_report")
    reset_outbox()
    _with_password()
    assert send_report("smtp.example.com", "kira@example.com", "Review", "Body") is True
    assert len(SENT) == 1, f"The server saw {len(SENT)} messages."


def test_the_headers():
    """From, To and Subject are all set"""
    send_report = require("send_report")
    reset_outbox()
    _with_password()
    send_report("smtp.example.com", "kira@example.com", "Quarterly review", "Sales rose.")
    sent = SENT[0]
    assert sent["from"] == "guild@example.com", f"From was {sent['from']!r}"
    assert sent["to"] == "kira@example.com", f"To was {sent['to']!r}"
    assert sent["subject"] == "Quarterly review", f"Subject was {sent['subject']!r}"


def test_the_body():
    """The body arrives intact"""
    send_report = require("send_report")
    reset_outbox()
    _with_password()
    send_report("smtp.example.com", "kira@example.com", "Review", "Sales rose.")
    assert SENT[0]["body"].strip() == "Sales rose.", f"The body was {SENT[0]['body']!r}"


def test_tls_before_login():
    """The connection is encrypted before the password crosses it"""
    send_report = require("send_report")
    reset_outbox()
    _with_password()
    send_report("smtp.example.com", "kira@example.com", "Review", "Body")
    assert SENT[0]["tls"] is True, (
        "starttls() was never called, so the password would have crossed the network "
        "in the clear."
    )
    assert SENT[0]["user"] == "guild@example.com", f"It logged in as {SENT[0]['user']!r}"


def test_refuses_without_a_password():
    """A missing credential stops it before it connects"""
    send_report = require("send_report")
    reset_outbox()
    os.environ.pop("GUILD_MAIL_PASSWORD", None)
    try:
        send_report("smtp.example.com", "kira@example.com", "Review", "Body")
    except RuntimeError as exc:
        assert "GUILD_MAIL_PASSWORD" in str(exc), (
            f"The message was {str(exc)!r}; name the variable so it can be fixed."
        )
        assert not SENT, (
            "It connected anyway. Refuse before connecting — an unauthenticated "
            "connection is noise in somebody else's logs."
        )
        return
    raise AssertionError("A missing password should raise RuntimeError.")


def test_password_not_hardcoded():
    """The credential comes from the environment"""
    send_report = require("send_report")
    reset_outbox()
    os.environ["GUILD_MAIL_PASSWORD"] = "a-different-one"
    send_report("smtp.example.com", "kira@example.com", "Review", "Body")
    assert SENT, "Nothing was sent with a valid password set."
