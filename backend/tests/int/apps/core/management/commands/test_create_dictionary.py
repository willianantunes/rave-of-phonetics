from io import StringIO

import pytest

from django.core.management import CommandError
from django.core.management import call_command

from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from tests.support.cmu_utils import create_database_from_fake_cmu_content
from tests.support.models_utils import create_dictionary


@pytest.mark.django_db
def test_should_throw_error_given_dictionary_table_is_empty():
    # Act
    with pytest.raises(CommandError) as command_error:
        call_command("create_dictionary")
    # Assert
    assert command_error.value.args[0] == "Dictionary table is empty. Fill it first"


@pytest.mark.django_db
def test_should_create_dictionary():
    # Arrange
    cmu_dict_content = """
        RAVE  R EY1 V
        OF  AH1 V
        LIVE  L AY1 V
        LIVE(1)  L IH1 V
        PHONETICS  F AH0 N EH1 T IH0 K S
        DON'T  D OW1 N T
        EVER  EH1 V ER0
        IF  IH1 F
        YOU  Y UW1
        PLEASE  P L IY1 Z
        AD-HOC  AE1 D HH AA1 K
    """
    create_database_from_fake_cmu_content(cmu_dict_content)
    out = StringIO()
    count_before_acting = Dictionary.objects.count()
    assert count_before_acting == 11
    # Act
    call_command("create_dictionary", stdout=out)
    # Assert
    assert out.getvalue().startswith("Was en-gb-x-rp created? True")
    assert Language.objects.count() == 2
    expected_saved_entries = count_before_acting - 1
    number_of_entries = count_before_acting + expected_saved_entries
    assert Dictionary.objects.count() == number_of_entries
    rave_word = Dictionary.objects.get(word_or_symbol="rave", language__language_tag="en-gb-x-rp")
    of_word = Dictionary.objects.get(word_or_symbol="of", language__language_tag="en-gb-x-rp")
    live_word = Dictionary.objects.get(word_or_symbol="live", language__language_tag="en-gb-x-rp")
    phonetics_word = Dictionary.objects.get(word_or_symbol="phonetics", language__language_tag="en-gb-x-rp")
    dont_word = Dictionary.objects.get(word_or_symbol="don't", language__language_tag="en-gb-x-rp")
    ever_word = Dictionary.objects.get(word_or_symbol="ever", language__language_tag="en-gb-x-rp")
    if_word = Dictionary.objects.get(word_or_symbol="if", language__language_tag="en-gb-x-rp")
    you_word = Dictionary.objects.get(word_or_symbol="you", language__language_tag="en-gb-x-rp")
    please_word = Dictionary.objects.get(word_or_symbol="please", language__language_tag="en-gb-x-rp")
    adhoc_word = Dictionary.objects.get(word_or_symbol="ad-hoc", language__language_tag="en-gb-x-rp")
    assert rave_word.ipa_phonemic == "ɹ ˈeɪ v"
    assert of_word.ipa_phonemic == "ˈɒ v"
    assert live_word.ipa_phonemic == "l ˈaɪ v"
    assert phonetics_word.ipa_phonemic == "f ə n ˈɛ t ɪ k s"
    assert dont_word.ipa_phonemic == "d ˈəʊ n t"
    assert ever_word.ipa_phonemic == "ˈɛ v ɐ"
    assert if_word.ipa_phonemic == "ˈɪ f"
    assert you_word.ipa_phonemic == "j ˈuː"
    assert please_word.ipa_phonemic == "p l ˈiː z"
    assert adhoc_word.ipa_phonemic == "ˈæ d h ˈɒ k"
    all_words = [
        rave_word,
        of_word,
        live_word,
        phonetics_word,
        dont_word,
        ever_word,
        if_word,
        you_word,
        please_word,
        adhoc_word,
    ]
    for word in all_words:
        assert word.version == Dictionary.Version.V_1
        assert word.classification == Dictionary.WordClassification.UNDEFINED
        assert not word.ipa_phonemic_syllables
        assert not word.ipa_phonetic
        assert not word.ipa_phonetic_syllables


@pytest.mark.django_db
def test_should_create_missed_word():
    # First Arrange
    cmu_dict_content = """
        RAVE  R EY1 V
    """
    create_database_from_fake_cmu_content(cmu_dict_content)
    count_before_acting = Dictionary.objects.count()
    assert count_before_acting == 1
    out = StringIO()
    # First Act
    call_command("create_dictionary", stdout=out)
    # First Assert
    call_command("create_dictionary", stdout=out)
    assert out.getvalue().startswith("Was en-gb-x-rp created? True")
    assert Language.objects.count() == 2
    assert Dictionary.objects.count() == 2
    # Second Arrange
    word, phonemic = "to", "tuː"
    language = Language.objects.get(language_tag="en-us")
    create_dictionary(word, language, ipa_phonemic=phonemic)
    assert Dictionary.objects.count() == 3
    # Second Act
    call_command("create_dictionary", stdout=out)
    # Second Assert
    assert Dictionary.objects.count() == 4
    rave_word = Dictionary.objects.get(word_or_symbol="rave", language__language_tag="en-gb-x-rp")
    to_word = Dictionary.objects.get(word_or_symbol="to", language__language_tag="en-gb-x-rp")
    assert rave_word.ipa_phonemic == "ɹ ˈeɪ v"
    assert to_word.ipa_phonemic == "t ˈuː"
    all_words = [rave_word, to_word]
    for word in all_words:
        assert word.version == Dictionary.Version.V_1
        assert word.classification == Dictionary.WordClassification.UNDEFINED
        assert not word.ipa_phonemic_syllables
        assert not word.ipa_phonetic
        assert not word.ipa_phonetic_syllables
