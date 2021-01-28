import pytest

from django.core.management import call_command


@pytest.fixture(autouse=True)
def whitenoise_workaround(settings):
    """
    Get rid of whitenoise "No directory at" warning and errors related to statics.
    Pytest change DEBUG to False, that is why this is needed.

    Related:
        - http://whitenoise.evans.io/en/stable/django.html#whitenoise-makes-my-tests-run-slow
        - http://whitenoise.evans.io/en/stable/django.html#why-do-i-get-valueerror-missing-staticfiles-manifest-entry-for
        - https://stackoverflow.com/a/63947954/3899136
        - https://github.com/evansd/whitenoise/issues/215
        - https://github.com/evansd/whitenoise/issues/191
        - https://github.com/evansd/whitenoise/commit/4204494d44213f7a51229de8bc224cf6d84c01eb
        - https://stackoverflow.com/a/54989744/3899136
    """
    settings.WHITENOISE_AUTOREFRESH = True
    settings.WHITENOISE_MANIFEST_STRICT = False


@pytest.fixture(scope="session", autouse=True)
def collect_static():
    # Do not forget to run `npm run build` to have what is needed concerning Django Template
    call_command("collectstatic", verbosity=0, interactive=False)
