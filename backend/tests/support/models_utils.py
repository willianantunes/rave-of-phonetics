from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from rave_of_phonetics.apps.core.models import ResearchedWord
from rave_of_phonetics.apps.core.models import Suggestion


def create_dictionary(
    word_or_symbol,
    language,
    arpabet_phoneme=None,
    ipa_phonemic=None,
    ipa_phonetic=None,
    classification=Dictionary.WordClassification.UNDEFINED,
    version=Dictionary.Version.V_1,
):
    return Dictionary.objects.create(
        word_or_symbol=word_or_symbol,
        classification=classification,
        version=version,
        arpabet_phoneme=arpabet_phoneme,
        ipa_phonemic=ipa_phonemic,
        ipa_phonetic=ipa_phonetic,
        language=language,
    )


def create_language(language_tag):
    return Language.objects.create(language_tag=language_tag)


def create_suggestion(word_or_symbol, ipa_phonemic, ipa_phonetic=None, explanation=None, language_tag="en-us"):
    return Suggestion.objects.create(
        word_or_symbol=word_or_symbol,
        ipa_phonemic=ipa_phonemic,
        ipa_phonetic=ipa_phonetic,
        explanation=explanation,
        language_tag=language_tag,
    )


def create_researched_word_entries(words, language_tag="en-us"):
    objects_to_be_saved = []
    for word in words:
        to_be_saved = ResearchedWord(word_or_symbol=word, language_tag=language_tag)
        objects_to_be_saved.append(to_be_saved)
    ResearchedWord.objects.bulk_create(objects_to_be_saved)
