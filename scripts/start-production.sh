#!/usr/bin/env bash

python manage.py collectstatic --no-input

if [[ ${DJANGO_BIND_ADDRESS+x} ]] && [[ ${DJANGO_BIND_PORT+x} ]];
then
    echo "OK! Using custom ADRESSS $DJANGO_BIND_ADDRESS and PORT $DJANGO_BIND_PORT"
    gunicorn -cpython:gunicorn_config -b ${DJANGO_BIND_ADDRESS}:${DJANGO_BIND_PORT} rave_of_phonetics.wsgi
else
    echo "Using 0.0.0.0:8000"
    gunicorn -cpython:gunicorn_config -b 0.0.0.0:8000 rave_of_phonetics.wsgi
fi
