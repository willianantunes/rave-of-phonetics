import logging
import re

from dataclasses import dataclass
from typing import Any
from typing import Dict
from typing import List
from typing import NamedTuple
from typing import Optional
from typing import Union

import transcriber_wrapper

from rave_of_phonetics.apps.core.models import Dictionary

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class DictionaryEntry:
    classification: str
    version: str
    phonemic: str
    phonemic_syllables: Optional[str]
    phonetic: Optional[str]
    phonetic_syllables: Optional[str]


@dataclass(frozen=True)
class Transcription:
    word: str
    entries: Optional[List[DictionaryEntry]] = None


class DictEntry(NamedTuple):
    word_or_symbol: str


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


def text_to_transcription(
    text: str, with_stress=False, language="en-us", preserve_punctuation=True, through_database=False
) -> Union[List[Transcription], List[Dict]]:
    logger.debug(f"Text to be transcribed: {text}")
    logger.debug(f"Chosen language and stress configuration: {language} / {with_stress}")
    text_to_be_transcribed = _newline_to_spaces(text)
    text_to_be_transcribed = text_to_be_transcribed.split(" ")
    text_to_be_transcribed = _only_words(text_to_be_transcribed)

    if not through_database:
        phones = transcribers[language].transcribe(text_to_be_transcribed, with_stress, preserve_punctuation)

        result = []
        for index, phone in enumerate(phones):
            result.append({"word": text_to_be_transcribed[index], "phone": phone})

        return result
    else:
        # With stress and punctuation will be handled by the front-end
        # No need to consult all the way back the service just to compute everything again consuming I/O
        queryset = Dictionary.objects.filter(language__language_tag=language)
        queryset.filter(word_or_symbol__in=text_to_be_transcribed)
        fields = [
            "word_or_symbol",
            "version",
            "classification",
            "ipa_phonemic",
            "ipa_phonemic_syllables",
            "ipa_phonetic",
            "ipa_phonetic_syllables",
        ]
        result = list(queryset.filter(word_or_symbol__in=text_to_be_transcribed).values_list(*fields, named=True))
        # Let's say the result has the following: ["rave", "of", "of", "phonetics"]
        # The idea is to flatten with the details of each entry
        # Like the word LIVE, there are two ways to speak the same word
        flattened_result = _flatten_dict_entries_by_word(result)

        transcriptions = []
        for word in text_to_be_transcribed:
            dict_entries = flattened_result.get(word)
            if dict_entries:
                dictionary_entries_setup = []
                for dict_entry in dict_entries:
                    entry_setup = DictionaryEntry(
                        dict_entry.classification,
                        dict_entry.version,
                        dict_entry.ipa_phonemic,
                        dict_entry.ipa_phonemic_syllables,
                        dict_entry.ipa_phonetic,
                        dict_entry.ipa_phonetic_syllables,
                    )
                    dictionary_entries_setup.append(entry_setup)
                transcription = Transcription(word, dictionary_entries_setup)
                transcriptions.append(transcription)
            else:
                transcription = Transcription(word)
                transcriptions.append(transcription)

        return transcriptions


def _flatten_dict_entries_by_word(entries: List[DictEntry]) -> Dict[str, Any]:
    dictionary_entries = {}
    for entry in entries:
        dict_entry = dictionary_entries.get(entry.word_or_symbol)
        if dict_entry:
            dict_entry.append(entry)
        else:
            dictionary_entries[entry.word_or_symbol] = []
            dictionary_entries[entry.word_or_symbol].append(entry)

    return dictionary_entries


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
