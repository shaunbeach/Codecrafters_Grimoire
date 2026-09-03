import logging


def sum_takings(amounts, log_path):
    logging.basicConfig(
        filename=log_path,
        level=logging.DEBUG,
        format="%(levelname)s: %(message)s",
        force=True,
    )

    total = 0
    for amount in amounts:
        if amount < 0:
            logging.warning(f"skipping negative amount: {amount}")
            continue
        total += amount
        logging.debug(f"adding {amount}, running total {total}")

    logging.info(f"finished with total {total}")
    return total
