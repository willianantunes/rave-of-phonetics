import json
import os

from logging import Formatter
from pathlib import Path
from typing import Optional

from corsheaders.defaults import default_headers
from pythonjsonlogger.jsonlogger import JsonFormatter

from rave_of_phonetics.apps.core.apps import CoreConfig
from rave_of_phonetics.support.django_helpers import eval_env_as_boolean
from rave_of_phonetics.support.django_helpers import getenv_or_raise_exception

BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = getenv_or_raise_exception("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = eval_env_as_boolean("DJANGO_DEBUG", False)

DJANGO_ALLOWED_HOSTS: Optional[str] = os.getenv("ALLOWED_HOSTS")
if DJANGO_ALLOWED_HOSTS:
    ALLOWED_HOSTS = DJANGO_ALLOWED_HOSTS.split(",")
else:
    ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "rest_framework",
    CoreConfig.name,
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
]

DISABLE_CORS = eval_env_as_boolean("DISABLE_CORS", False)
INSTALLED_APPS.append("corsheaders")
MIDDLEWARE.insert(1, "corsheaders.middleware.CorsMiddleware")
CORS_ALLOW_HEADERS = list(default_headers) + ["x-api-key"]

if not DISABLE_CORS:
    CORS_ORIGIN_ALLOW_ALL = eval_env_as_boolean("CORS_ORIGIN_ALLOW_ALL", False)
    CORS_ALLOW_CREDENTIALS = eval_env_as_boolean("CORS_ALLOW_CREDENTIALS", False)

    TMP_CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS")
    if TMP_CORS_ALLOWED_ORIGINS and "," in TMP_CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS = [origin for origin in TMP_CORS_ALLOWED_ORIGINS.split(",")]

    TMP_CORS_EXPOSE_HEADERS = os.getenv("CORS_EXPOSE_HEADERS")
    CORS_EXPOSE_HEADERS = TMP_CORS_EXPOSE_HEADERS.split(",") if TMP_CORS_EXPOSE_HEADERS else []
else:
    CORS_ORIGIN_ALLOW_ALL = True
    CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = "rave_of_phonetics.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "rave_of_phonetics.wsgi.application"

REST_FRAMEWORK = {"EXCEPTION_HANDLER": "rest_framework.views.exception_handler"}

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3",}}

# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Logging
# https://docs.djangoproject.com/en/3.1/topics/logging/


class CustomJsonFormatter(JsonFormatter):
    def format(self, record):
        """Formats a log record and serializes to json"""
        try:
            record.msg = json.loads(record.getMessage())
        except json.JSONDecodeError:
            pass

        return super().format(record)

    def process_log_record(self, log_record: dict) -> dict:
        """
        Override of the jsonlogger.JsonFormatter method. Adds Stackdriver's
        severity field.
        """

        log_record["severity"] = log_record["levelname"]
        del log_record["levelname"]

        return log_record


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "development": {"()": Formatter, "format": "%(asctime)s - level=%(levelname)s - %(name)s - %(message)s",},
        "standard": {"()": CustomJsonFormatter, "format": "%(levelname)-8s [%(asctime)s] %(name)s: %(message)s",},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": os.getenv("DEFAULT_LOG_FORMATTER", "standard"),}
    },
    "loggers": {
        "": {"level": os.getenv("ROOT_LOG_LEVEL", "INFO"), "handlers": ["console"]},
        "rave_of_phonetics": {
            "level": os.getenv("PROJECT_LOG_LEVEL", "INFO"),
            "handlers": ["console"],
            "propagate": False,
        },
        "django": {"level": os.getenv("DJANGO_LOG_LEVEL", "INFO"), "handlers": ["console"]},
        "django.db.backends": {"level": os.getenv("DJANGO_DB_BACKENDS_LOG_LEVEL", "INFO"), "handlers": ["console"]},
    },
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = "/static/"

# Custom things

RECAPTCHA_SCORE_THRESHOLD = float(getenv_or_raise_exception("RECAPTCHA_SCORE_THRESHOLD"))
RECAPTCHA_TOKEN_HEADER = getenv_or_raise_exception("RECAPTCHA_TOKEN_HEADER")
CORS_ALLOW_HEADERS.append(RECAPTCHA_TOKEN_HEADER)
RECAPTCHA_SECRET_KEY = getenv_or_raise_exception("RECAPTCHA_SECRET_KEY")
RECAPTCHA_ENDPOINT = getenv_or_raise_exception("RECAPTCHA_ENDPOINT")
