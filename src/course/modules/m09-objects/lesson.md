# The Menagerie

You have been keeping a character in a dictionary — `{"name": "Kira", "health": 100}`
— and writing workings that take it as an argument. It works.

It works until the day somebody writes `character["helth"] = 50` and creates a
new key instead of an error. Until two workings disagree about whether health
can go negative. Until the seven workings that operate on a character have
drifted into four different files and nobody can find them all.

An artisan does not leave the parts of a thing lying about. A **class** binds the
data and the behaviour that belongs to it into one object, and makes that object
responsible for its own state.

## Defining one

```python
class Character:
    def __init__(self, name, health=100):
        self.name = name
        self.health = health
```

- `class` names use `CapWords`, not `snake_case`
- `__init__` runs automatically when one is made. It is not quite a constructor
  — the object already exists; this is the setting-up
- `self` is the object being built. Assigning `self.name` creates an
  **attribute** that lives on that particular object

## Making them

```python
kira = Character("Kira")
bo = Character("Bo", health=50)

kira.name        # 'Kira'
bo.health        # 50
```

`kira` and `bo` are entirely independent. Changing one does not touch the other
— which is precisely the isolation the dictionary version kept losing.

## Methods

A method is a working defined inside the class. Its first parameter is always
`self`, and Python passes it for you:

```python
class Character:
    def __init__(self, name, health=100):
        self.name = name
        self.max_health = health
        self.health = health

    def is_alive(self):
        return self.health > 0

    def take_damage(self, amount):
        self.health = max(0, self.health - amount)
        return self.health
```

```python
kira.take_damage(30)              # what you write
Character.take_damage(kira, 30)   # what Python actually does
```

Forget `self` in the definition and you get `TypeError: takes 0 positional
arguments but 1 was given` — the single most common class error there is, and
now you know exactly what it means.

## Objects talking to each other

Inside a class, always go through `self`:

```python
    def attack(self, other):
        if not self.is_alive():
            return 0
        other.take_damage(self.strength)
        return self.strength
```

`other` is another `Character`. Note what this working does **not** do: it does
not reach into `other.health` and subtract. It asks `other` to take damage, and
lets `other` decide what that means.

That is the whole idea. An object owns its own state. Everyone else asks.

## __str__

Print an object without help and you get something useless:

```python
print(kira)      # <__main__.Character object at 0x104f1e2d0>
```

```python
    def __str__(self):
        return f"{self.name}: {self.health}/{self.max_health} HP"
```

```python
print(kira)      # Kira: 100/100 HP
```

Methods with double underscores at both ends are **dunder** methods. Python
calls them for you when the matching syntax is used: `__init__` on
construction, `__str__` on `str()` and `print()`, `__len__` on `len()`, `__eq__`
on `==`. You are not overriding magic; you are answering questions the language
already knows how to ask.

## Inheritance

A goblin, a dragon and a slime are all enemies. They share most of their
behaviour and differ in a few specific ways.

```python
class Enemy:
    def __init__(self, name, health, damage):
        self.name = name
        self.health = health
        self.damage = damage

    def attack(self):
        return self.damage


class Goblin(Enemy):
    pass
```

`class Goblin(Enemy)` means "a Goblin **is an** Enemy". Even defining nothing,
it already has `__init__` and `attack`.

## super()

A subclass usually wants its own `__init__` that fills in the details, then
hands off to the parent for the shared work:

```python
class Goblin(Enemy):
    def __init__(self):
        super().__init__("Goblin", 20, 4)
```

`super()` means "the class I inherit from". Calling `super().__init__(...)` is
how you avoid copying the parent's setup into every child — and how you stay
correct when the parent changes next year.

Forgetting it is the classic inheritance bug: your object is missing attributes
the parent would have set, and it blows up with `AttributeError` much later,
somewhere else entirely.

## Overriding

Define a method with the same name and yours wins:

```python
class Dragon(Enemy):
    def __init__(self):
        super().__init__("Dragon", 200, 30)

    def attack(self):
        return super().attack() * 2      # fire breath
```

`super().attack()` runs the parent's version and gives you the result to work
with — almost always better than re-typing the parent's logic. This `Dragon`
keeps working if `Enemy.attack` grows a bonus tomorrow.

When you call `dragon.attack()`, Python looks on `Dragon` first, then `Enemy`,
then `object`, and uses the first it finds. That search order is why a subclass
can change *some* behaviour without knowing anything about the rest.

## Why it earns its keep

```python
for monster in [Goblin(), Dragon(), Slime()]:
    print(monster.describe(), monster.attack())
```

That loop does not know or care which class each object is. Each responds in its
own way. This is **polymorphism**, and it is the reason inheritance exists: you
write the loop once, and adding a new kind of monster next month requires no
change to it at all.

```python
isinstance(dragon, Dragon)     # True
isinstance(dragon, Enemy)      # True — a Dragon is an Enemy
```
