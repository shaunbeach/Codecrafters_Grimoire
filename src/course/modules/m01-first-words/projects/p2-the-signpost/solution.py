def build_sign(name):
    top = "~ " + name + " ~"
    rule = "=" * len(top)
    return top + "\n" + rule
