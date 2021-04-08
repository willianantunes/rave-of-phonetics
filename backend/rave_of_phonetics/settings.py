import json
import os

from logging import Formatter
from pathlib import Path
from typing import Any
from typing import Dict
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
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    CoreConfig.name,
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

DISABLE_CORS = eval_env_as_boolean("DISABLE_CORS", False)
INSTALLED_APPS.append("corsheaders")
MIDDLEWARE.insert(1, "corsheaders.middleware.CorsMiddleware")
CORS_ALLOW_HEADERS = list(default_headers) + ["x-api-key"]

if not DISABLE_CORS:
    CORS_ALLOW_ALL_ORIGINS = eval_env_as_boolean("CORS_ALLOW_ALL_ORIGINS", False)
    CORS_ALLOW_CREDENTIALS = eval_env_as_boolean("CORS_ALLOW_CREDENTIALS", False)

    TMP_CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS")
    if TMP_CORS_ALLOWED_ORIGINS:
        if "," in TMP_CORS_ALLOWED_ORIGINS:
            CORS_ALLOWED_ORIGINS = [origin for origin in TMP_CORS_ALLOWED_ORIGINS.split(",")]
        else:
            CORS_ALLOWED_ORIGINS = [TMP_CORS_ALLOWED_ORIGINS]
    TMP_CORS_EXPOSE_HEADERS = os.getenv("CORS_EXPOSE_HEADERS")
    CORS_EXPOSE_HEADERS = TMP_CORS_EXPOSE_HEADERS.split(",") if TMP_CORS_EXPOSE_HEADERS else []
else:
    CORS_ALLOW_ALL_ORIGINS = True
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

REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "rest_framework.views.exception_handler",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": int(os.getenv("PAGE_SIZE", 20)),
    "DEFAULT_AUTHENTICATION_CLASSES": (),
}

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
# https://www.postgresql.org/docs/13/libpq-connect.html#LIBPQ-PARAMKEYWORDS

DATABASE_READ_WRITE = "default"
db_host = getenv_or_raise_exception("DB_HOST")
if ":" in db_host:
    db_host, db_port = db_host.split(":")
else:
    db_port = getenv_or_raise_exception("DB_PORT")

DATABASES: Dict[str, Any] = {
    DATABASE_READ_WRITE: {
        "ENGINE": getenv_or_raise_exception("DB_ENGINE"),
        "NAME": getenv_or_raise_exception("DB_NAME"),
        "OPTIONS": {
            "options": f"-c search_path={getenv_or_raise_exception('DB_SCHEMA')}",
        },
        "USER": getenv_or_raise_exception("DB_USER"),
        "HOST": db_host,
        "PORT": db_port,
        "PASSWORD": getenv_or_raise_exception("DB_PASS"),
    }
}

DB_USE_SSL = eval_env_as_boolean("DB_USE_SSL", True)
if DB_USE_SSL:
    # verify-full: only try an SSL connection, verify that the server certificate is issued by a trusted CA and that the requested server host name matches that in the certificate
    # require: only try an SSL connection. If a root CA file is present, verify the certificate in the same way as if verify-ca was specified
    ssl_mode = os.getenv("DB_SSL_MODE", "require")
    DATABASES[DATABASE_READ_WRITE]["OPTIONS"]["sslmode"] = ssl_mode

if os.getenv("PYTEST_RUNNING"):
    del DATABASES["default"]["OPTIONS"]

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
        "development": {
            "()": Formatter,
            "format": "%(asctime)s - level=%(levelname)s - %(name)s - %(message)s",
        },
        "standard": {
            "()": CustomJsonFormatter,
            "format": "%(levelname)-8s [%(asctime)s] %(name)s: %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": os.getenv("DEFAULT_LOG_FORMATTER", "standard"),
        }
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

# RECAPTCHA
RECAPTCHA_SCORE_THRESHOLD = float(getenv_or_raise_exception("RECAPTCHA_SCORE_THRESHOLD"))
RECAPTCHA_TOKEN_HEADER = getenv_or_raise_exception("RECAPTCHA_TOKEN_HEADER")
CORS_ALLOW_HEADERS.append(RECAPTCHA_TOKEN_HEADER)
RECAPTCHA_SECRET_KEY = getenv_or_raise_exception("RECAPTCHA_SECRET_KEY")
RECAPTCHA_ENDPOINT = getenv_or_raise_exception("RECAPTCHA_ENDPOINT")

# GitHub OAuth / Netlify CMS
GITHUB_OAUTH_ORIGIN = getenv_or_raise_exception("GITHUB_OAUTH_ORIGIN")
GITHUB_OAUTH_AUTHORIZATION_URL = os.getenv("GITHUB_OAUTH_AUTHORIZATION_URL", "https://github.com/login/oauth/authorize")
GITHUB_OAUTH_TOKEN_URL = os.getenv("GITHUB_OAUTH_TOKEN_URL", "https://github.com/login/oauth/access_token")
GITHUB_OAUTH_APP_CLIENT_ID = getenv_or_raise_exception("GITHUB_OAUTH_APP_CLIENT_ID")
GITHUB_OAUTH_APP_CLIENT_SECRET = getenv_or_raise_exception("GITHUB_OAUTH_APP_CLIENT_SECRET")
GITHUB_OAUTH_APP_SCOPES = os.getenv("GITHUB_OAUTH_APP_SCOPES", "repo,user")

# Batch processing
DJANGO_BULK_BATCH_SIZE = int(os.getenv("DJANGO_BULK_BATCH_SIZE", 1000))
