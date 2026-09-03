def run_session(commands):
    store = {}
    responses = []
    for line in commands:
        responses.append(run_command(store, line))
    return store, responses
