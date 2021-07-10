# Back-end

Django project that handles everything related to the back-end side of [Rave of Phonetics](https://www.raveofphonetics.com/).

## Tasks that can be executed by Django Q

To verify mentions:

    rave_of_phonetics.apps.twitter.tasks.verify_mentions_and_send_transcription_if_required

## Running the project

Just issue the following command:

    docker-compose up remote-interpreter

If you want to simulate production, then you can type:

    docker-compose up production

In order to check the files included in the final container image, first you enter the container and list the files:

    docker-compose run production bash
    ls -la

## Installing new packages and their updates

You can install it through docker-compose issuing the following command for example:

    docker-compose run remote-interpreter pipenv --python 3 install transcriber-wrapper
    docker-compose run remote-interpreter pipenv install django-q

Now if you want to update them:

    docker-compose run remote-interpreter pipenv update

After that it's required to update your remote interpreter:

    docker-compose build remote-interpreter

## Generating new migration recipes

    docker-compose run remote-interpreter python manage.py makemigrations

## Testing CORS

Localhost:

```shell
curl -i -X 'OPTIONS' \
-H 'Origin: https://dev.raveofphonetics.com' \
-H 'Access-Control-Request-Method: POST' \
'http://localhost:8080/api/v1/transcribe'
```

DEV environment:

```shell
curl -i -X 'OPTIONS' \
-H 'Origin: https://dev.raveofphonetics.com' \
-H 'Access-Control-Request-Method: POST' \
'https://api.dev.raveofphonetics.com/api/v1/transcribe'
```

PRD:

```shell
curl -i -X 'OPTIONS' \
-H 'Origin: https://dev.raveofphonetics.com' \
-H 'Access-Control-Request-Method: POST' \
'http://localhost:8080/api/v1/transcribe'
```
