def toll(age, is_guild_member):
    if age < 12:
        fare = 0.0
    elif age < 65:
        fare = 5.0
    else:
        fare = 2.5

    if is_guild_member:
        fare = round(fare * 0.8, 2)

    return fare
