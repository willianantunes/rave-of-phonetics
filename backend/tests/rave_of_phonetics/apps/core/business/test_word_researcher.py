import pytest

from django.utils import timezone

from rave_of_phonetics.apps.core.business.word_researcher import most_sought_words
from rave_of_phonetics.apps.core.business.word_researcher import persist_what_user_sought
from rave_of_phonetics.apps.core.models import ResearchedWord
from tests.support.models_utils import create_researched_word_entries


@pytest.mark.django_db
def test_should_persist_words():
    # Arrange
    words = ["do", "you", "know", "that", "you", "know", "that", "thing", "did", "you"]
    language_tag = "en-us"
    ip_address = "192.168.0.1"
    # Act
    persist_what_user_sought(words, language_tag, ip_address)
    # Assert
    assert ResearchedWord.objects.count() == 6
    do_researched_word = ResearchedWord.objects.get(word_or_symbol="do")
    assert do_researched_word.language_tag == language_tag
    assert do_researched_word.ip_address == ip_address
    current_date = timezone.now().date()
    assert do_researched_word.created_at.date() == current_date


@pytest.mark.django_db
def test_should_persist_words_even_if_ip_address_is_not_available():
    # Arrange
    words = ["c'mon", "dude", "c'mon", "dude"]
    language_tag = "en-gb"
    ip_address = None
    # Act
    persist_what_user_sought(words, language_tag, ip_address)
    # Assert
    assert ResearchedWord.objects.count() == 2
    cmon_researched_word = ResearchedWord.objects.get(word_or_symbol="c'mon")
    assert cmon_researched_word.language_tag == language_tag
    assert cmon_researched_word.ip_address == ip_address
    current_date = timezone.now().date()
    assert cmon_researched_word.created_at.date() == current_date


@pytest.mark.django_db
def test_should_persist_words_without_duplicate_them_given_ip_address_is_the_same_for_the_current_day():
    # Arrange
    to_be_persisted = (["c'mon", "dude", "c'mon", "dude"], "en-gb", "192.168.0.1")
    # Act
    persist_what_user_sought(*to_be_persisted)
    persist_what_user_sought(*to_be_persisted)
    persist_what_user_sought(*to_be_persisted)
    persist_what_user_sought(*to_be_persisted)
    # Assert
    assert ResearchedWord.objects.count() == 2


@pytest.mark.django_db
def test_should_persist_words_given_ip_address_is_none():
    # Arrange
    to_be_persisted = (["c'mon", "dude", "c'mon", "dude"], "en-gb", None)
    # Act
    persist_what_user_sought(*to_be_persisted)
    persist_what_user_sought(*to_be_persisted)
    persist_what_user_sought(*to_be_persisted)
    persist_what_user_sought(*to_be_persisted)
    # Assert
    assert ResearchedWord.objects.count() == 8


@pytest.mark.django_db
def test_should_return_most_sought_words():
    # Arrange
    words = [
        "c'mon",
        "dude",
        "c'mon",
        "dude",
        "select",
        "researched",
        "word",
        "that",
        "to",
        "change",
        "django",
        "administration",
        "select",
        "welcome",
        "throught",
        "authentication",
        "and",
        "authorization",
        "throught",
        "authentication",
        "and",
        "throught",
        "authorization",
        "this",
        "throught",
    ]
    create_researched_word_entries(words)
    assert ResearchedWord.objects.count() == 25
    # Assert
    queryset = ResearchedWord.objects.all()
    result = most_sought_words(queryset)
    # Assert
    assert result.count() == 16
    three_most_sought_words = result[:3]
    three_most_sought_words_as_list = list(three_most_sought_words)
    assert three_most_sought_words_as_list == [
        {"word_or_symbol": "throught", "times": 4},
        {"word_or_symbol": "dude", "times": 2},
        {"word_or_symbol": "c'mon", "times": 2},
    ]
