import logging
import re

from typing import Dict
from typing import List

from phonemizer import phonemize
from phonemizer.separator import Separator

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


def text_to_transcription(text: str, with_stress=False, language="en-us") -> List[Dict]:
    logger.debug(f"Text to be transcribed: {text}")
    logger.debug(f"Chosen language and stress configuration: {language} / {with_stress}")
    text_to_be_transcribed = _newline_to_spaces(text)
    text_to_be_transcribed = text_to_be_transcribed.split(" ")
    text_to_be_transcribed = _only_words(text_to_be_transcribed)

    separator = Separator(phone=None, syllable=None, word=" ")

    phones = phonemize(
        text_to_be_transcribed,
        preserve_punctuation=True,
        language=language,
        backend="espeak",
        strip=True,
        with_stress=with_stress,
        separator=separator,
    )

    result = []
    for index, phone in enumerate(phones):
        result.append({"word": text_to_be_transcribed[index], "phone": phone})

    return result
