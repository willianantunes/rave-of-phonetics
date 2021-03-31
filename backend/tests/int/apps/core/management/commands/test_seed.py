from io import StringIO

import pytest

from django.contrib.auth.models import User
from django.core.management import CommandError
from django.core.management import call_command

from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from tests.resources.resource_loader import resource_location
from tests.support.cmu_utils import create_database_from_fake_cmu_content


@pytest.mark.django_db
def test_should_do_nothing_when_seed_is_called_with_no_parameters():
    out = StringIO()
    call_command("seed", stdout=out)

    assert not out.getvalue()
    assert Language.objects.count() == 0
    assert Dictionary.objects.count() == 0
    assert User.objects.filter(username="admin").count() == 0


@pytest.mark.django_db
def test_should_create_super_user_only():
    out = StringIO()
    call_command("seed", "--create-super-user", stdout=out)

    assert out.getvalue() == "Creating ADMIN username admin\n"
    assert User.objects.filter(username="admin").count() == 1
    assert Language.objects.count() == 0
    assert Dictionary.objects.count() == 0


def test_should_raise_error_given_no_argument_was_provided_for_cmu_file_location_option():
    with pytest.raises(CommandError) as e:
        call_command("seed", "--cmu-file-location")

    assert e.value.args[0] == "Error: argument --cmu-file-location: expected one argument"


@pytest.mark.django_db
def test_should_create_database_with_sample_part():
    cmu_file_location = resource_location("sample-part-1-cmudict-0.7b.txt")

    call_command("seed", "--cmu-file-location", cmu_file_location)

    assert Dictionary.objects.count() == 74

    abandoned_dict_entry = Dictionary.objects.get(word_or_symbol="abandoned")

    assert abandoned_dict_entry.arpabet_phoneme == "ah0 b ae1 n d ah0 n d"
    assert abandoned_dict_entry.arpabet_phoneme_syllables == "ah0 • b ae1 n • d ah0 n d"
    assert abandoned_dict_entry.ipa_phonemic == "ə ˈb æ n d ə n d"
    assert abandoned_dict_entry.ipa_phonemic_syllables == "ə • ˈb æ n • d ə n d"
    assert abandoned_dict_entry.ipa_phonetic is None
    assert abandoned_dict_entry.classification == Dictionary.WordClassification.UNDEFINED
    assert abandoned_dict_entry.version == Dictionary.Version.V_1


@pytest.mark.django_db
def test_should_create_database_with_entire_cmu_pronunciation_dictionary(mocker):
    mocker.patch("rave_of_phonetics.settings.DJANGO_BULK_BATCH_SIZE", 20_000)
    cmu_file_location = resource_location("cmudict-0.7b.txt")

    call_command("seed", "--cmu-file-location", cmu_file_location)

    number_of_current_lines = 134429
    invalid_header_lines = 126
    invalid_footer_lines = 5
    correct_count_of_valid_lines = number_of_current_lines - invalid_header_lines - invalid_footer_lines

    assert Dictionary.objects.count() == correct_count_of_valid_lines


@pytest.mark.django_db
def test_should_delete_duplicated_lines():
    # Arrange
    cmu_dict_content = """
        BE  B IY1
        BE(1)  B IY0
        BEEN  B IH1 N
        BEEN(1)  B AH0 N
        BEEN(2)  B IH0 N
        IS  IH1 Z
        IS(1)  IH0 Z
        LIVE  L AY1 V
        LIVE(1)  L IH1 V
        OF  AH1 V
        OF(1)  AH0 V
    """
    # Act
    create_database_from_fake_cmu_content(cmu_dict_content)
    # Assert
    assert Dictionary.objects.count() == 7
    assert Dictionary.objects.filter(word_or_symbol="be").count() == 1
    assert Dictionary.objects.filter(word_or_symbol="been").count() == 2
    assert Dictionary.objects.filter(word_or_symbol="is").count() == 1
    assert Dictionary.objects.filter(word_or_symbol="live").count() == 2
    assert Dictionary.objects.filter(word_or_symbol="of").count() == 1
