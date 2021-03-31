#!/usr/bin/env bash

python manage.py makemigrations
python manage.py migrate
python manage.py seed --create-super-user --cmu-file-location tests/resources/cmudict-0.7b.txt
python manage.py create_dictionary

python manage.py runserver 0.0.0.0:8000
