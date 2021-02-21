import os

from distutils.util import strtobool

from django.http.response import HttpResponseRedirectBase


def eval_env_as_boolean(varname, standard_value) -> bool:
    return bool(strtobool(os.getenv(varname, str(standard_value))))


def getenv_or_raise_exception(varname: str) -> str:
    """
    Retrieve a environment variable that MUST be set or raise an appropriate exception.
    """
    env = os.getenv(varname)

    if env is None:
        raise EnvironmentError(f"Environment variable {varname} is not set!")

    return env


class HttpResponseTemporaryRedirect(HttpResponseRedirectBase):
    status_code = 307
