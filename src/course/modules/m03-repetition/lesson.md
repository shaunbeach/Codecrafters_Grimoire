# The Long Road

An `if` runs once and is done with you. A loop keeps going — and that is the
first working that can genuinely get away from an apprentice.

Every loop you write is a small promise that it will stop. Learn to check that
promise before you run the thing, because the version that does not stop will
sit there consuming your machine while you wonder what you did.

## Repeating while something holds

```python
count = 3
while count > 0:
    print(count)
    count = count - 1
print("Go!")
```

```
3
2
1
Go!
```

Python checks the condition, runs the body, then checks again. Three parts must
all be present:

1. something set up **before** the loop — `count = 3`
2. a condition that *can* become false — `count > 0`
3. something in the body that **moves toward** that — `count = count - 1`

Leave out the third and you have written a loop that never ends. Your program
hangs. This app will stop you after fifteen seconds and say so, which is kinder
than a real terminal will be.

`count = count - 1` shortens to `count -= 1`. The same works for `+=`, `*=`, `/=`.

## Leaving early, and skipping ahead

`break` leaves the loop immediately, from however deep inside the body you are:

```python
while True:
    guess = input("Guess: ")
    if guess == "42":
        print("Got it!")
        break
```

`while True:` looks reckless and is not, *provided* the body contains a
guaranteed `break`. It is the honest way to write "loop until something
happens", and you will meet it constantly.

`continue` abandons this pass and goes straight back to the top:

```python
for number in numbers:
    if number < 0:
        continue          # skip the negatives entirely
    total += number
```

Both are tools for saying "this particular case is not interesting" without
wrapping the rest of the body in an `else`.

## Repeating over things

Where `while` repeats until a condition breaks, `for` walks through a sequence:

```python
for animal in ["cat", "dog", "owl"]:
    print(animal)
```

`animal` is a name you choose. Python assigns each item to it in turn, and stops
when there is nothing left — so a `for` loop over a finite thing cannot run
forever. That is a large part of why it is preferred.

## range()

```python
range(5)          # 0, 1, 2, 3, 4      — five numbers, starting at zero
range(1, 6)       # 1, 2, 3, 4, 5      — start included, stop excluded
range(0, 10, 2)   # 0, 2, 4, 6, 8      — every second one
```

**The stop value is excluded.** Everyone trips on this once. It is not arbitrary:
it means `range(n)` gives you exactly `n` numbers, and `range(len(items))` gives
you exactly the valid positions of `items`.

To count 1 through 10, you write `range(1, 11)`.

## The remainder

`%` gives what is left over after division:

```python
17 % 5     # 2    — 5 goes into 17 three times, with 2 spare
10 % 5     # 0
7 % 2      # 1
```

A remainder of zero means the division was exact, and that is the whole trick
behind an enormous number of small programs:

```python
if number % 3 == 0:
    print(f"{number} divides by three")
```

`n % 2 == 0` is how you ask whether a number is even.

`%` has a partner, `//`, which gives the whole part of the division. Together
they account for everything:

```python
17 // 5     # 3
17 % 5      # 2
17 // 5 * 5 + 17 % 5    # 17 — nothing is lost between them
```

## Order still matters

A number divisible by both 3 and 5 is also divisible by 3. So if you test for 3
first, you will never reach the both-case:

```python
# Wrong
if n % 3 == 0:
    result = "Fizz"
elif n % 15 == 0:      # unreachable
    result = "FizzBuzz"
```

Same lesson as the crossroads: **most specific first**.

## Building up an answer

Start with an empty thing and add to it as you go. This pattern is called an
**accumulator**, and it turns up in every language there is:

```python
total = 0
for number in numbers:
    total += number
```

```python
hints = []
hints.append("too low")
```

```python
result = ""
for letter in word:
    result += letter.upper()
```

Initialise before the loop. Update inside it. Use it after.

## Randomness you can test

`random` ships with Python; you just have to ask:

```python
import random

random.randint(1, 100)          # a whole number from 1 to 100, both included
random.choice(["a", "b", "c"])  # one item from a list
random.random()                 # a float from 0.0 up to 1.0
```

`randint` includes **both** ends, unlike almost everything else in Python.
`random.randint(1, 6)` really can give you 6.

Truly random code is impossible to test, so real programs *seed* the generator —
give it a fixed starting point so the sequence repeats:

```python
random.seed(42)
print(random.randint(1, 100))   # the same number, every single run
```

You will not need to seed anything here. The checks do it for you, which is why
your randomised workings behave predictably when they are graded.
