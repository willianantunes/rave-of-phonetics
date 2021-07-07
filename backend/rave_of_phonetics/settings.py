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
from rave_of_phonetics.apps.twitter.apps import TwitterConfig
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
    EXTRA_ALLOWED_HOST: Optional[str] = os.getenv("EXTRA_ALLOWED_HOST")
    FINAL_ALLOWED_HOSTS = f"{DJANGO_ALLOWED_HOSTS},{EXTRA_ALLOWED_HOST}" if EXTRA_ALLOWED_HOST else DJANGO_ALLOWED_HOSTS
    ALLOWED_HOSTS = FINAL_ALLOWED_HOSTS.split(",")
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
    "django_q",
    CoreConfig.name,
    TwitterConfig.name,
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


# Django Q configuration
# https://django-q.readthedocs.io/en/latest/install.html
# https://django-q.readthedocs.io/en/latest/brokers.html

# Dealing with TIMEOUT and RETRY
q_cluster_timeout = int(os.getenv("Q_CLUSTER_TIMEOUT_IN_MIN", 5)) * 60
q_cluster_retry = q_cluster_timeout * 2
if q_cluster_custom_retry := os.getenv("Q_CLUSTER_RETRY_IN_MIN"):
    q_cluster_retry = int(q_cluster_custom_retry) * 60
django_q_retry_configuration_is_wrong = q_cluster_retry <= q_cluster_timeout
if django_q_retry_configuration_is_wrong:
    raise EnvironmentError("Q_CLUSTER_RETRY_IN_MIN should be less than Q_CLUSTER_TIMEOUT_IN_MIN")

# Dealing with WORKER and QUEUE LIMIT
q_cluster_workers = int(os.getenv("Q_CLUSTER_WORKERS", 1))
q_cluster_queue_limit = q_cluster_workers ** 2
if q_cluster_custom_queue_limit := os.getenv("Q_CLUSTER_QUEUE_LIMIT"):
    q_cluster_queue_limit = int(q_cluster_custom_queue_limit)

Q_CLUSTER = {
    # https://django-q.readthedocs.io/en/latest/configure.html#orm-configuration
    "orm": DATABASE_READ_WRITE,
    "has_replica": True,
    # https://django-q.readthedocs.io/en/latest/configure.html#name
    "name": "DQScheduler",
    # The number of workers to use in the cluster.
    # Defaults to CPU count of the current host, but can be set to a custom number
    "workers": q_cluster_workers,
    # This does not limit the amount of tasks that can be queued on the broker,
    # but rather how many tasks are kept in memory by a single cluster.
    "queue_limit": q_cluster_queue_limit,
    # Sets the number of messages each cluster tries to get from the broker per call.
    "bulk": int(os.getenv("Q_CLUSTER_BULK", 10)),
    # The number of seconds a worker is allowed to spend on a task before it’s terminated.
    "timeout": q_cluster_timeout,
    # The number of seconds a broker will wait for a cluster to finish a task, before it’s presented again.
    "retry": q_cluster_retry,
    # Limit the number of retry attempts for failed tasks. Set to 0 for infinite retries. Defaults to 0
    "max_attempts": int(os.getenv("Q_CLUSTER_ATTEMPTS", 2)),
}


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
        "django-q": {
            "level": os.getenv("DJANGO_Q_LOG_LEVEL", "INFO"),
            "handlers": ["console"],
            "propagate": False,
        },
    },
}

if eval_env_as_boolean("RUNNING_DJANGO_Q", False):
    import logging.config

    # This is not called automatically by the framework when using DJANGO-Q
    logging.config.dictConfig(LOGGING)


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

# IP address discovery
IP_DISCOVERY_NUMBER_OF_PROXIES = int(os.getenv("IP_DISCOVERY_NUMBER_OF_PROXIES", 0))

# Twitter
TWITTER_CONSUMER_KEY = os.getenv("TWITTER_CONSUMER_KEY")
TWITTER_CONSUMER_SECRET = os.getenv("TWITTER_CONSUMER_SECRET")
