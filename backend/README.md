# Back-end

Django project that handles everything related to the back-end side of [Rave of Phonetics](https://www.raveofphonetics.com/).

## To study

- https://en.wikipedia.org/wiki/CMU_Pronouncing_Dictionary
- https://github.com/mphilli/English-to-IPA
- https://github.com/open-dict-data/ipa-dict
- https://open-dict-data.github.io/
- https://github.com/repp/big-phoney
- https://pyphen.org/
- https://github.com/cmusphinx/cmudict-tools
- https://github.com/JoseLlarena/Britfone/blob/master/britfone.main.3.0.1.csv
- https://en.wikipedia.org/wiki/Comparison_of_General_American_and_Received_Pronunciation#:~:text=4%20Bibliography-,Phonological%20differences,followed%20by%20a%20vowel%20sound.&text=Similarly%2C%20where%20GA%20has%20r,%C9%99%2F%20or%20%2F%C9%9C%CB%90%2F
- https://www.lumenvox.com/knowledgebase/index.php?/article/AA-01085/0/UK-English-Phonemes.html

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

Now if you want to update them:

    docker-compose run remote-interpreter pipenv update

After that it's required to update your remote interpreter:

    docker-compose build remote-interpreter

## Running commands

    docker-compose run remote-interpreter sh

If you'd like to run commands to test IPA output, first look the documentations

- https://github.com/espeak-ng/espeak-ng/blob/master/docs/guide.md

You must be at `/usr/bin/`. Then try one of these below:

```
espeak-ng "Hello my friend, stay awhile and listen." -ven-us -x --ipa -q --sep=_
espeak-ng "Hello my friend stay awhile and listen." -ven-us -x --ipa -q
espeak-ng "Constitution" -ven-us -x --ipa -q --sep=_
espeak-ng "Hello my friend, stay awhile and listen." -v en-us -x --ipa -q
espeak-ng "This is a test" -v en-us -x --ipa -q
```

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
