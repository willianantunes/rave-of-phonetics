import requests

from corsheaders.conf import conf
from corsheaders.middleware import ACCESS_CONTROL_ALLOW_HEADERS
from corsheaders.middleware import ACCESS_CONTROL_ALLOW_ORIGIN
from django.urls import reverse
from pytest_mock import MockFixture

from rave_of_phonetics.settings import RECAPTCHA_TOKEN_HEADER


def test_cors_should_not_allow(live_server, mocker: MockFixture):
    class FakeSettings:
        @property
        def CORS_ALLOW_HEADERS(self):
            return conf.CORS_ALLOW_HEADERS

        @property
        def CORS_ALLOW_METHODS(self):
            return conf.CORS_ALLOW_METHODS

        @property
        def CORS_ALLOW_CREDENTIALS(self):
            return False

        @property
        def CORS_PREFLIGHT_MAX_AGE(self):
            return conf.CORS_PREFLIGHT_MAX_AGE

        @property
        def CORS_ALLOW_ALL_ORIGINS(self):
            return False

        @property
        def CORS_ALLOWED_ORIGINS(self):
            return conf.CORS_ALLOWED_ORIGINS

        @property
        def CORS_ALLOWED_ORIGIN_REGEXES(self):
            return conf.CORS_ALLOWED_ORIGIN_REGEXES

        @property
        def CORS_EXPOSE_HEADERS(self):
            return conf.CORS_EXPOSE_HEADERS

        @property
        def CORS_URLS_REGEX(self):
            return conf.CORS_URLS_REGEX

        @property
        def CORS_REPLACE_HTTPS_REFERER(self):
            return conf.CORS_REPLACE_HTTPS_REFERER

    mocker.patch("corsheaders.middleware.conf", FakeSettings())

    transcribe_endpoint = reverse("v1/transcribe")
    headers = {
        "Origin": "https://example.com",
        "Access-Control-Request-Method": "POST",
    }

    response = requests.options(f"{live_server.url}{transcribe_endpoint}", headers=headers)

    assert not any(key.startswith("Access-Control-Allow") for key in response.headers)


def test_cors_should_allow_origin_given_custom_name(live_server, mocker: MockFixture):
    fake_origin = "https://example.com"

    class FakeSettings:
        @property
        def CORS_ALLOW_HEADERS(self):
            return conf.CORS_ALLOW_HEADERS

        @property
        def CORS_ALLOW_METHODS(self):
            return conf.CORS_ALLOW_METHODS

        @property
        def CORS_ALLOW_CREDENTIALS(self):
            return True

        @property
        def CORS_PREFLIGHT_MAX_AGE(self):
            return conf.CORS_PREFLIGHT_MAX_AGE

        @property
        def CORS_ALLOW_ALL_ORIGINS(self):
            return [fake_origin]

        @property
        def CORS_ALLOWED_ORIGINS(self):
            return conf.CORS_ALLOWED_ORIGINS

        @property
        def CORS_ALLOWED_ORIGIN_REGEXES(self):
            return conf.CORS_ALLOWED_ORIGIN_REGEXES

        @property
        def CORS_EXPOSE_HEADERS(self):
            return conf.CORS_EXPOSE_HEADERS

        @property
        def CORS_URLS_REGEX(self):
            return conf.CORS_URLS_REGEX

        @property
        def CORS_REPLACE_HTTPS_REFERER(self):
            return conf.CORS_REPLACE_HTTPS_REFERER

    mocker.patch("corsheaders.middleware.conf", FakeSettings())

    transcribe_endpoint = reverse("v1/transcribe")
    headers = {
        "Origin": fake_origin,
        "Access-Control-Request-Method": "POST",
    }

    response = requests.options(f"{live_server.url}{transcribe_endpoint}", headers=headers)

    assert response.headers[ACCESS_CONTROL_ALLOW_ORIGIN] == fake_origin
    assert RECAPTCHA_TOKEN_HEADER in response.headers[ACCESS_CONTROL_ALLOW_HEADERS]

    total_access_control_allow_headers = sum([1 for key in response.headers if key.startswith("Access-Control-Allow")])
    total_access_control_headers = sum([1 for key in response.headers if key.startswith("Access-Control")])
    assert total_access_control_allow_headers == 4
    assert total_access_control_headers == total_access_control_allow_headers + 1
