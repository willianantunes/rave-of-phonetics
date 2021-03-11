#!/usr/bin/env bash

TARGET_PROJECT=rave_of_phonetics
TARGET_TEST_PROJECT=tests
TARGET_FOLDERS="$TARGET_PROJECT $TARGET_TEST_PROJECT"

isort $TARGET_FOLDERS -c --diff
black --check --diff $TARGET_FOLDERS
# mypy will only target the project folder
mypy $TARGET_PROJECT
