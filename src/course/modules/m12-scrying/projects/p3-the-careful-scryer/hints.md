Find the items first and check the list is not empty before you loop. That check
is the raise.
---
Inside the loop, each item needs both spans. If either is missing, `continue`.

The price text is like `'£4.50'`, so strip the symbol before converting:
`text.replace("£", "").strip()`. Wrap the `float()` in a `try` and `continue` on
`ValueError`.
---
```python
items = soup.find_all("li", class_="item")
if not items:
    raise LookupError("no elements matched li.item — the page layout may have changed")

out = []
for item in items:
    name = item.find("span", class_="name")
    price = item.find("span", class_="price")
    if not name or not price:
        continue
    try:
        amount = float(price.get_text(strip=True).replace("£", ""))
    except ValueError:
        continue
    out.append({"name": name.get_text(strip=True), "price": amount})
return out
```
