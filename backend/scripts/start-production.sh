#!/usr/bin/env bash

python manage.py collectstatic --no-input

gunicorn -cpython:gunicorn_config -b ${DJANGO_BIND_ADDRESS}:${PORT:-$DJANGO_BIND_PORT} rave_of_phonetics.wsgi
