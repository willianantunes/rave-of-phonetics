import logging
import re

from django.core.exceptions import SuspiciousOperation
from django.http import HttpResponseBadRequest
from django.http import HttpResponseNotAllowed
from django.http import HttpResponseNotFound
from django.http import HttpResponseServerError
from django.shortcuts import render
from phonemizer import phonemize

logger = logging.getLogger(__name__)

_supported_language = ["en-us", "en-gb", "fr-fr", "es", "it"]


def _newline_to_spaces(text_to_be_transcribed):
    return re.sub(r"(\r\n|\r|\n)", " ", text_to_be_transcribed)


def _only_words(text_to_be_transcribed):
    valid_words = []

    for text in text_to_be_transcribed:
        regex = (
            r"^[ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ"
            r"¡¿çÇŒœßØøÅåÆæÞþÐð"
            r"\"\w\d\s\-'.,&#@:?!\{\}\[\]()$\/\\]+$"
        )
        if bool(re.search(regex, text)):
            valid_words.append(text)

    return valid_words


def changelog(request):
    return render(request, "core/pages/changelog.html")


def index(request):
    if request.method == "POST":
        text_to_be_transcribed = request.POST.get("text-to-be-transcribed")
        language = request.POST.get("chosen-language")
        if language not in _supported_language:
            raise SuspiciousOperation("Inputted language not supported")
        if not text_to_be_transcribed:
            raise SuspiciousOperation("Text not supplied")
        logger.debug(f"Text to be transcribed: {text_to_be_transcribed}")
        text_to_be_transcribed = _newline_to_spaces(text_to_be_transcribed)
        text_to_be_transcribed = text_to_be_transcribed.split(" ")
        text_to_be_transcribed = _only_words(text_to_be_transcribed)

        phones = phonemize(text_to_be_transcribed, language=language, backend="espeak", strip=True)

        result = []
        for index, phone in enumerate(phones):
            result.append({"word": text_to_be_transcribed[index], "phone": phone})
        context = {"transcription": result, "text": str.join(" ", text_to_be_transcribed), "language": language}

        return render(request, "core/pages/home.html", context)

    if request.method == "GET":
        return render(request, "core/pages/home.html")

    return HttpResponseNotAllowed(["POST", "GET"])


def handler400(request, exception):
    # https://docs.djangoproject.com/en/3.1/ref/urls/#handler404
    return HttpResponseBadRequest(render(request, "core/errors/400.html"))


def handler404(request, exception):
    # https://docs.djangoproject.com/en/3.1/ref/urls/#handler404
    return HttpResponseNotFound(render(request, "core/errors/404.html"))


def handler500(request):
    # https://docs.djangoproject.com/en/3.1/ref/urls/#handler500
    return HttpResponseServerError(render(request, "core/errors/500.html"))
