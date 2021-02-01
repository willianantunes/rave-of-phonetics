import json
import os

from logging import Formatter
from pathlib import Path
from typing import Optional

from pythonjsonlogger.jsonlogger import JsonFormatter

from rave_of_phonetics.apps.core.apps import CoreConfig
from rave_of_phonetics.support.django_helpers import eval_env_as_boolean
from rave_of_phonetics.support.django_helpers import getenv_or_raise_exception
from rave_of_phonetics.support.static_files import CustomStaticFilesConfig

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
    "whitenoise.runserver_nostatic",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "rave_of_phonetics.support.static_files.CustomStaticFilesConfig",
    CoreConfig.name,
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

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

# "Common" middleware
# https://docs.djangoproject.com/en/3.1/ref/middleware/#module-django.middleware.common

PREPEND_WWW = eval_env_as_boolean("PREPEND_WWW", False)

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# Django collects the static files into STATIC_ROOT
STATIC_ROOT = os.getenv("STATIC_ROOT", "staticfiles")
STATIC_ROOT = os.path.join(BASE_DIR, STATIC_ROOT)
# Your CDN FQDN for example or whatever is hosting your statics/assets
STATIC_HOST = os.environ.get("DJANGO_STATIC_HOST", "")
# The REQUEST PATH where your statics/assets are
STATIC_URL = os.getenv("STATIC_URL", "/static/")
STATIC_URL = STATIC_HOST + STATIC_URL

# Internal usage

SITE_URL = getenv_or_raise_exception("SITE_URL")