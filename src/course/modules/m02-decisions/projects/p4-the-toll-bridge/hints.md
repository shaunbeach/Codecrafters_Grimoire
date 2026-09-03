Two questions, not one. First: which band is this traveller in? Second: do they
get the discount? Answer them in that order and each is easy.
---
Give the fare a name, set it in an `if / elif / else`, and *then* adjust it:

```python
if age < 12:
    fare = 0.0
elif ...
```

The discount is a multiplication — 20% off means you keep 80%, so `fare * 0.8`.
---
```python
if age < 12:
    fare = 0.0
elif age < 65:
    fare = 5.0
else:
    fare = 2.5

if is_guild_member:
    fare = round(fare * 0.8, 2)

return fare
```
