def price(base, discount_percent=0, tax_rate=0.05):
    discounted = base * (1 - discount_percent / 100)
    return round(discounted * (1 + tax_rate), 2)
