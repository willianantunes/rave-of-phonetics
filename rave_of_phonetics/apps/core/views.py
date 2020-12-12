from django.shortcuts import render
from phonemizer import phonemize


def index(request):
    if request.method == "POST":
        word_to_be_evaluated = request.POST["word-to-be-evaluated"]
        phones = phonemize(word_to_be_evaluated, language="en-us", backend="espeak", strip=False)
        context = {"phones": phones, "word": word_to_be_evaluated}
        return render(request, "core/pages/home.html", context)
    else:
        return render(request, "core/pages/home.html")
