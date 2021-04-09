from typing import Generic
from typing import Iterator
from typing import Optional
from typing import TypeVar

from django.db.models import QuerySet

_Z = TypeVar("_Z")


class QueryType(Generic[_Z], QuerySet):
    def __iter__(self) -> Iterator[_Z]:
        ...

    def first(self) -> Optional[_Z]:
        ...
