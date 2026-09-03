# Tonight's watch log.
import os

os.makedirs("/data", exist_ok=True)

with open("/data/watch.log", "w") as handle:
    handle.write(
        "INFO: watch begins\n"
        "WARN: gate left unbarred\n"
        "ERROR: torch out on the east wall\n"
        "\n"
        "INFO: all quiet\n"
        "ERRORLOG: this is not an error line\n"
        "ERROR: sighting in the treeline\n"
    )
