from contextlib import contextmanager

from requests import Session
from requests.adapters import HTTPAdapter
from urllib3 import Retry


class CustomHTTPAdapter(HTTPAdapter):
    def __init__(self, max_retries: Retry, timeout: int, stream: bool):
        super(CustomHTTPAdapter, self).__init__(max_retries=max_retries)
        self.timeout = timeout
        self.stream = stream

    def send(self, *args, **kwargs):
        kwargs["timeout"] = self.timeout
        kwargs["stream"] = self.stream
        return super(CustomHTTPAdapter, self).send(*args, **kwargs)


@contextmanager
def requests_session(retries=3, backoff_factor=0.1, timeout=35, stream=False, **kwargs):
    session = Session()

    max_retries = Retry(total=retries, backoff_factor=backoff_factor, **kwargs,)
    adapter = CustomHTTPAdapter(max_retries, timeout, stream)

    session.mount("https://", adapter)
    session.mount("http://", adapter)

    try:
        yield session
    finally:
        session.close()


def user_ip_address(request, number_of_proxies=0):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    remote_addr = request.META.get("REMOTE_ADDR")
    num_proxies = number_of_proxies

    if num_proxies is not None:
        if num_proxies == 0 or xff is None:
            return remote_addr
        addrs = xff.split(",")
        client_addr = addrs[-min(num_proxies, len(addrs))]
        return client_addr.strip()

    return "".join(xff.split()) if xff else remote_addr
