# Back-end

Django project that handle everything related to the back-end side of [Rave of Phonetics](https://www.raveofphonetics.com/).

## To study

- https://en.wikipedia.org/wiki/CMU_Pronouncing_Dictionary
- https://github.com/mphilli/English-to-IPA

## Running the project

Just issue the following command:

    docker-compose up remote-interpreter

If you want to simulate production, then you can type:

    docker-compose up production

In order to check the files included in the final container image, first you enter the container and list the files:

    docker-compose run production bash
    ls -la

## Installing new packages

You can install it through docker-compose issuing the following command for example:

    docker-compose run remote-interpreter pipenv --python 3 install parsel --dev

After that it's required to update your remote interpreter:

    docker-compose build remote-interpreter

## Running commands

    docker-compose run remote-interpreter sh

If you'd like to run commands to test IPA output, first look the documentations

- https://github.com/espeak-ng/espeak-ng/blob/master/docs/guide.md

You must be at `/usr/bin/`. Then try one of these below:

```
espeak-ng "Hello my friend, stay awhile and listen." -ven-us -x --ipa -q --sep=_
espeak-ng "Constitution" -ven-us -x --ipa -q --sep=_
espeak-ng "Hello my friend, stay awhile and listen." -v en-us -x --ipa -q
espeak-ng "This is a test" -v en-us -x --ipa -q
```
