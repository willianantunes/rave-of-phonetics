import re


def clear_newlines_and_spaces(text: str):
    return re.sub(r"(\r\n|\r|\n| )", "", text)


def clear_newlines(text: str):
    return re.sub(r"(\r\n|\r|\n|)", "", text)


def strip_left_and_right_side(value: str, rules: str = " \t\r\n") -> str:
    return value.strip(rules) if value else None
