import logging
import re

from typing import Dict
from typing import List

import transcriber_wrapper

logger = logging.getLogger(__name__)


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


transcriber_en_us = transcriber_wrapper.build_transcriber("en-us")
transcriber_en_gb = transcriber_wrapper.build_transcriber("en-gb")
transcriber_fr_fr = transcriber_wrapper.build_transcriber("fr-fr")
transcriber_es = transcriber_wrapper.build_transcriber("es")
transcriber_it = transcriber_wrapper.build_transcriber("it")


transcribers = {
    "en-us": transcriber_en_us,
    "en-gb": transcriber_en_gb,
    "fr-fr": transcriber_fr_fr,
    "es": transcriber_es,
    "it": transcriber_it,
}


def text_to_transcription(text: str, with_stress=False, language="en-us", preserve_punctuation=True) -> List[Dict]:
    logger.debug(f"Text to be transcribed: {text}")
    logger.debug(f"Chosen language and stress configuration: {language} / {with_stress}")
    text_to_be_transcribed = _newline_to_spaces(text)
    text_to_be_transcribed = text_to_be_transcribed.split(" ")
    text_to_be_transcribed = _only_words(text_to_be_transcribed)

    phones = transcribers[language].transcribe(text_to_be_transcribed, with_stress, preserve_punctuation)

    result = []
    for index, phone in enumerate(phones):
        result.append({"word": text_to_be_transcribed[index], "phone": phone})

    return result
