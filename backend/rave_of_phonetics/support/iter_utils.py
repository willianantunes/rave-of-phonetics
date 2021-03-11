from itertools import chain
from itertools import islice
from typing import Any
from typing import Callable
from typing import List
from typing import Optional


def chunker(iterable, size):
    """
    See more details at: `https://stackoverflow.com/a/54431431/3899136`
    """

    def chunker_generator(generator, size):
        iterator = iter(generator)
        for first in iterator:

            def chunk():
                yield first
                for more in islice(iterator, size - 1):
                    yield more

            yield [k for k in chunk()]

    if not hasattr(iterable, "__len__"):
        # Generators don't have len, so fall back to slower method that works with generators
        for chunk in chunker_generator(iterable, size):
            yield chunk
        return

    it = iter(iterable)

    for i in range(0, len(iterable), size):
        yield [k for k in islice(it, size)]


def index_of_first(target_list: List, predicate: Callable[[str], bool]) -> Optional[int]:
    for index, item in enumerate(target_list):
        if predicate(item):
            return index
    return None


def flatten(target_list: List[List[Any]]):
    return list(chain.from_iterable(target_list))
