#!/usr/bin/env bash

python manage.py migrate
python manage.py seed --create-super-user --cmu-file-location tests/resources/cmudict-0.7b.txt
python manage.py create_dictionary

gunicorn -cpython:gunicorn_config -b ${DJANGO_BIND_ADDRESS}:${PORT:-$DJANGO_BIND_PORT} rave_of_phonetics.wsgi
