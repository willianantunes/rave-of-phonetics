from typing import Generator


def number_of_lines(file_name: str, encoding="UTF-8") -> int:
    with open(file_name, mode="r", encoding=encoding) as file:
        return sum(1 for line in file)


def each_line_from_file(file_name: str, encoding="UTF-8") -> Generator[str, None, None]:
    with open(file_name, mode="r", encoding=encoding) as file:
        for line in file:
            yield line
