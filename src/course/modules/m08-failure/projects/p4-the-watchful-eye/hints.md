Configure logging first, then loop. The configuration is one call, and getting
its arguments right is most of this drill.
---
```python
logging.basicConfig(
    filename=log_path,
    level=logging.DEBUG,
    format="%(levelname)s: %(message)s",
    force=True,
)
```

Then `logging.debug(...)`, `logging.warning(...)` and `logging.info(...)` inside
and after the loop. Build the messages with f-strings so they read exactly as
the brief shows.
---
```python
import logging

def sum_takings(amounts, log_path):
    logging.basicConfig(filename=log_path, level=logging.DEBUG,
                        format="%(levelname)s: %(message)s", force=True)
    total = 0
    for amount in amounts:
        if amount < 0:
            logging.warning(f"skipping negative amount: {amount}")
            continue
        total += amount
        logging.debug(f"adding {amount}, running total {total}")
    logging.info(f"finished with total {total}")
    return total
```
