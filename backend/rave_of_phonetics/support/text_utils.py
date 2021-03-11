from typing import Optional


def strip_left_and_right_sides(value: str, rules: str = " \t\r\n") -> Optional[str]:
    return value.strip(rules) if value else None
