## The situation

The guild roster is a book of members, and each member has a page of their own:

```python
roster = {
    "Kira": {"rank": "Captain", "town": "Marrow Ford"},
    "Bo": {"rank": "Apprentice"},
}
```

The clerk on the desk gets asked hundreds of questions a day, and roughly a
third of them are about people who left years ago or details nobody recorded.
The book must not fall apart when that happens.

## What good looks like

```python
look_up(roster, "Kira", "rank")     # 'Captain'
look_up(roster, "Bo", "town")       # 'unrecorded'    no town on Bo's page
look_up(roster, "Ana", "rank")      # 'no such member'
look_up({}, "Kira", "rank")         # 'no such member'
```

## Your objective

**`look_up(roster, name, field)`** — return the value of that field on that
member's page.

- a member who is not in the roster gives `'no such member'`
- a member whose page has no such field gives `'unrecorded'`
- it must never raise `KeyError`

## Watch out for

Two different kinds of missing thing, with two different answers. Telling a
clerk "we have no record of Ana" is useful; telling them "Ana's town is
unrecorded" when Ana does not exist is a lie.

So you cannot collapse this into a single `.get()` with one default — the two
lookups have to be separate.
