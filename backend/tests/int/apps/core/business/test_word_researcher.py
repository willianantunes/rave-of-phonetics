import pytest

from django.utils import timezone

from rave_of_phonetics.apps.core.business.word_researcher import persist_what_user_sought
from rave_of_phonetics.apps.core.models import ResearchedWord


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
