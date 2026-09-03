ROSTER = {
    "Kira": {"rank": "Captain", "town": "Marrow Ford"},
    "Bo": {"rank": "Apprentice"},
}


def look_up(roster, name, field):
    page = roster.get(name)
    if page is None:
        return "no such member"
    return page.get(field, "unrecorded")
