import re

from django.http import HttpResponseNotAllowed
from django.shortcuts import render
from phonemizer import phonemize


def only_words(text_to_be_transcribed):
    valid_words = []

    for text in text_to_be_transcribed:
        if bool(re.search("^[A-Za-z0-9]+", text)):
            valid_words.append(text)

    return valid_words


def index(request):
    if request.method == "POST":
        text_to_be_transcribed = request.POST["text-to-be-transcribed"]
        text_to_be_transcribed = text_to_be_transcribed.split(" ")
        text_to_be_transcribed = only_words(text_to_be_transcribed)
        language = request.POST["chosen-language"]

        phones = phonemize(text_to_be_transcribed, language=language, backend="espeak", strip=True)

        result = []
        for index, phone in enumerate(phones):
            result.append({"word": text_to_be_transcribed[index], "phone": phone})
        context = {"transcription": result, "text": str.join(" ", text_to_be_transcribed), "language": language}

        return render(request, "core/pages/home.html", context)

    if request.method == "GET":
        return render(request, "core/pages/home.html")

    return HttpResponseNotAllowed(["POST", "GET"])
