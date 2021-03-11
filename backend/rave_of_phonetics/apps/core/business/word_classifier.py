import logging

from dataclasses import dataclass
from typing import List
from typing import Optional

from django.db.models import QuerySet
from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.support.iter_utils import flatten
from rave_of_phonetics.support.iter_utils import index_of_first

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Homophone:
    word_or_symbol: str
    phonemic: str
    phonetic: str


_english_vowels_diphthong = [
    "eɪ",
    "oʊ",
    "aʊ",
    "ɪə",
    "eə",
    "ɔɪ",
    "aɪ",
    "ʊə",
]

_english_vowels_short = [
    "ɪ",
    "e",
    "æ",
    "ʌ",
    "ʊ",
    "ɒ",
    "ə",
]


def discover_rhymes(word_or_symbol: str, language_tag: str) -> Optional[List[str]]:
    base_query_set = Dictionary.objects.filter(language__language_tag=language_tag)
    word_from_database: Optional[Dictionary] = base_query_set.filter(word_or_symbol=word_or_symbol).first()

    if not word_from_database:
        logger.debug(f"No entry for {language_tag} / {word_or_symbol}")
        return None
    else:
        updated_base_query_set = base_query_set.exclude(pk=word_from_database.pk)
        if not word_from_database.ipa_phonemic_syllables:
            logger.debug(f"No phonemic syllable available for {language_tag} / {word_or_symbol}")
            return None
        else:
            if language_tag == "en-us":
                return _discover_rhymes_for_cmu(word_from_database, updated_base_query_set)

            return _discover_rhymes_standard_way(word_from_database, updated_base_query_set)


def _discover_rhymes_standard_way(word_or_symbol: Dictionary, base_query_set: QuerySet) -> Optional[List[str]]:
    logger.debug("Discovering rhymes through STANDARD strategy by syllable...")
    syllables = word_or_symbol.transform_ipa_syllable_entry_to_object()
    number_of_syllables = len(syllables)
    logger.debug(f"The word '{word_or_symbol}' has {number_of_syllables} syllables")

    phonemic = _extract_phonemic_that_will_be_used_to_find_rhymes(syllables)
    result = base_query_set.filter(ipa_phonemic__endswith=phonemic)
    cleaned_result = [tuple_entry[0] for tuple_entry in result.values_list("word_or_symbol")]
    logger.debug(f"Total rhymes words found: {len(cleaned_result)}")

    return cleaned_result


def _extract_phonemic_that_will_be_used_to_find_rhymes(syllables: List[List[str]]) -> str:
    # Naive implementation!
    # https://en.m.wikipedia.org/wiki/Rhyme
    # For certain there is something more technical in terms of linguistics...
    number_of_syllables = len(syllables)
    if number_of_syllables == 1:
        syllables_to_be_used = syllables
    else:
        # All syllables, less the first one
        syllables_to_be_used = syllables[1::]
    inverted_syllables_to_be_used = syllables_to_be_used[::-1]
    index_number_last_element = len(syllables_to_be_used) - 1
    for index, entry in enumerate(inverted_syllables_to_be_used):
        index_diphthong = index_of_first(entry, lambda item: item in _english_vowels_diphthong)
        if index_diphthong:
            return _valid_phonemic_from_list_of_syllables(
                index,
                entry,
                index_diphthong,
                syllables_to_be_used,
                index_number_last_element,
            )
        index_short_vowel = index_of_first(entry, lambda item: item in _english_vowels_short)
        if index_short_vowel:
            return _valid_phonemic_from_list_of_syllables(
                index,
                entry,
                index_short_vowel,
                syllables_to_be_used,
                index_number_last_element,
            )
    # Let's use the last syllable then!
    # Remember: I'm wrapping in another list to comply with create_syllable_entry_ipa method
    last_syllable = [syllables_to_be_used[-1]]
    return Dictionary.create_syllable_entry_ipa(last_syllable)


def _valid_phonemic_from_list_of_syllables(
    syllable_entry_index: int,
    syllable_entry: List[str],
    where_to_cut: int,
    syllables: List[List[str]],
    index_number_last_element: int,
) -> str:
    phonemic_to_be_used = syllable_entry[where_to_cut::]
    where_to_start = index_number_last_element - syllable_entry_index
    syllables[where_to_start] = phonemic_to_be_used
    syllables_to_be_used = syllables[where_to_start::]
    syllables_to_be_used = [flatten(syllables_to_be_used)]
    return Dictionary.create_syllable_entry_ipa(syllables_to_be_used)


def _discover_rhymes_for_cmu(word_or_symbol: Dictionary, base_query_set: QuerySet) -> Optional[List[str]]:
    logger.debug("Discovering rhymes through ARPABET strategy")
    # Some important variables
    arpabet_stress_mark = "1"
    separator_mark = Dictionary.arpabet_phoneme_separator_mark
    phonemes = word_or_symbol.arpabet_phoneme.split(separator_mark)
    # First try
    phoneme_to_be_used = None
    for index, phoneme in enumerate(phonemes):
        if arpabet_stress_mark in phoneme:
            phoneme_to_be_used = separator_mark.join(phonemes[index:])
    # Then we should fallback to the common strategy
    if not phoneme_to_be_used:
        return _discover_rhymes_standard_way(word_or_symbol, base_query_set)
    # Otherwise, we can try!
    result = base_query_set.filter(arpabet_phoneme__endswith=phoneme_to_be_used)
    cleaned_result = [tuple_entry[0] for tuple_entry in result.values_list("word_or_symbol")]
    return cleaned_result


def discover_homophones(word_or_symbol: str, language_tag: str) -> Optional[List[Homophone]]:
    base_query_set = Dictionary.objects.filter(language__language_tag=language_tag)
    word_from_database: Optional[Dictionary] = base_query_set.filter(word_or_symbol=word_or_symbol).first()

    if not word_from_database:
        logger.debug(f"No entry for {language_tag} / {word_or_symbol}")
        return None
    else:
        updated_base_query_set = base_query_set.exclude(pk=word_from_database.pk)
        result = updated_base_query_set.filter(ipa_phonemic__exact=word_from_database.ipa_phonemic)
        cleaned_result = [
            Homophone(tuple_entry[0], tuple_entry[1], tuple_entry[2])
            for tuple_entry in result.values_list("word_or_symbol", "ipa_phonemic", "ipa_phonetic")
        ]
        logger.debug(f"Total homophones words found: {len(cleaned_result)}")

        return cleaned_result
