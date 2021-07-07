import random

_hello_words = [
    "Bonjour",
    "Hola",
    "Salve",
    "Guten Tag",
    "Olá",
    "Anyoung haseyo",
    "Goedendag",
    "Yassas",
    "Shalom",
    "God dag",
]


def give_some_hello_word() -> str:
    return random.choice(_hello_words)
