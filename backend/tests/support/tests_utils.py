import abc


def Any(*cls):
    """
    See  more details at: https://stackoverflow.com/a/21611963/3899136
    """

    class Any(metaclass=abc.ABCMeta):
        def __eq__(self, other):
            return isinstance(other, cls)

    for c in cls:
        Any.register(c)
    return Any()
