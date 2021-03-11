import pytest

from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from tests.support.models_utils import create_dictionary
from tests.support.models_utils import create_language


@pytest.mark.django_db
def test_should_create_languages():
    lang_1, lang_2 = "en-us", "en-gb"

    persisted_lang_1, persisted_lang_2 = create_language(lang_1), create_language(lang_2)

    assert persisted_lang_1.language_tag == lang_1
    assert persisted_lang_2.language_tag == lang_2
    assert Language.objects.count() == 2


@pytest.mark.django_db
def test_should_create_dictionaries():
    language = create_language("en-us")
    word_1, word_2, word_3, word_4, word_5 = "to", "two", "too", "tree", "three"
    phonemic_1, phonemic_2, phonemic_3 = "tuː", "tɹiː", "θɹiː"

    d_1 = create_dictionary(word_1, language, ipa_phonemic=phonemic_1)
    assert d_1.word_or_symbol == word_1
    assert d_1.ipa_phonemic == phonemic_1
    assert d_1.language.language_tag == language.language_tag
    create_dictionary(word_2, language, ipa_phonemic=phonemic_1)
    create_dictionary(word_3, language, ipa_phonemic=phonemic_1)
    create_dictionary(word_4, language, ipa_phonemic=phonemic_2)
    create_dictionary(word_5, language, ipa_phonemic=phonemic_3)

    assert Dictionary.objects.count() == 5
    assert language.dictionary_entries.count() == 5
