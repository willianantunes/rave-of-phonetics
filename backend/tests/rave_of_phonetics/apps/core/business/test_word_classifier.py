import pytest

from django.core.management import call_command

from rave_of_phonetics.apps.core.business.word_classifier import _extract_phonemic_that_will_be_used_to_find_rhymes
from rave_of_phonetics.apps.core.business.word_classifier import discover_homophones
from rave_of_phonetics.apps.core.business.word_classifier import discover_rhymes
from tests.resources.resource_loader import resource_location
from tests.support.cmu_utils import create_database_from_fake_cmu_content


@pytest.fixture
def create_database_rhymes_1():
    cmu_file_location = resource_location("sample-part-rhymes-1-cmudict-0.7b.txt")
    call_command("seed", "--cmu-file-location", cmu_file_location)


@pytest.fixture
def create_database_rhymes_1_1():
    cmu_file_location = resource_location("sample-part-rhymes-1-cmudict-0.7b.txt")
    # Using EN-GB just to force not using CMU logic. See word_classifier.py to understand more
    call_command("seed", "--cmu-file-location", cmu_file_location, "--use-language-tag", "en-gb")


@pytest.fixture
def create_database_rhymes_2():
    cmu_file_location = resource_location("sample-part-rhymes-2-cmudict-0.7b.txt")
    # Using EN-GB just to force not using CMU logic. See word_classifier.py to understand more
    call_command("seed", "--cmu-file-location", cmu_file_location, "--use-language-tag", "en-gb")


@pytest.fixture
def create_database_rhymes_3():
    cmu_file_location = resource_location("sample-part-rhymes-3-cmudict-0.7b.txt")
    # Using EN-GB just to force not using CMU logic. See word_classifier.py to understand more
    call_command("seed", "--cmu-file-location", cmu_file_location, "--use-language-tag", "en-gb")


@pytest.fixture
def create_database_homophones_1():
    cmu_file_location = resource_location("sample-part-homophones-1-cmudict-0.7b.txt")
    call_command("seed", "--cmu-file-location", cmu_file_location)


@pytest.fixture
def create_database_homophones_2():
    cmu_file_location = resource_location("sample-part-homophones-2-cmudict-0.7b.txt")
    call_command("seed", "--cmu-file-location", cmu_file_location)


@pytest.mark.django_db
def test_should_return_rhymes_from_word_sold_with_cmu(create_database_rhymes_1):
    word_to_be_analysed, language_tag = "sold", "en-us"

    rhymes = discover_rhymes(word_to_be_analysed, language_tag)

    assert rhymes == ["strolled", "told", "uncontrolled"]


@pytest.mark.django_db
def test_should_return_rhymes_from_word_sold_without_cmu(create_database_rhymes_1_1):
    word_to_be_analysed, language_tag = "sold", "en-gb"

    rhymes = discover_rhymes(word_to_be_analysed, language_tag)

    assert rhymes == ["strolled", "told", "uncontrolled"]


def test_should_properly_slice_syllables_list_scenario_1():
    syllables_word_sold = [["s", "oʊ", "l", "d"]]

    result = _extract_phonemic_that_will_be_used_to_find_rhymes(syllables_word_sold)

    assert result == "oʊ l d"


def test_should_properly_slice_syllables_list_scenario_2():
    syllables_word_function = [["ˈf", "ə", "ŋ", "k"], ["ʃ", "ə", "n"]]

    result = _extract_phonemic_that_will_be_used_to_find_rhymes(syllables_word_function)

    assert result == "ə n"


def test_should_properly_slice_syllables_list_scenario_3():
    # I changed the last syllable on purpose! Thus allowing the usage of the second to last syllable and ahead
    # I changed ["ʃ", "ə", "n"] to ["ʃ", "JAFAR", "n"]
    syllables_word_solicitation = [["s", "ə"], ["ˌl", "ɪ"], ["s", "ɪ"], ["ˈt", "eɪ"], ["ʃ", "JAFAR", "n"]]

    result = _extract_phonemic_that_will_be_used_to_find_rhymes(syllables_word_solicitation)

    assert result == "eɪ ʃ JAFAR n"


def test_should_properly_slice_syllables_list_scenario_4():
    # I changed the last and second to last syllables on purpose!
    # Thus allowing the usage of the antepenultimate (third from last) syllable and ahead
    # I changed ["ˈt", "eɪ"] ["ʃ", "ə", "n"] to ["ˈt", "IAGO"] ["ʃ", "JAFAR", "n"]
    syllables_word_solicitation = [["s", "ə"], ["ˌl", "ɪ"], ["s", "ɪ"], ["ˈt", "IAGO"], ["ʃ", "JAFAR", "n"]]

    result = _extract_phonemic_that_will_be_used_to_find_rhymes(syllables_word_solicitation)

    assert result == "ɪ ˈt IAGO ʃ JAFAR n"


@pytest.mark.django_db
def test_should_return_rhymes_from_word_function_without_cmu(create_database_rhymes_2):
    word_to_be_analysed, language_tag = "function", "en-gb"

    rhymes = discover_rhymes(word_to_be_analysed, language_tag)

    assert rhymes == ["compunction", "conjunction", "dysfunction", "injunction", "junction", "sanction", "malfunction"]


@pytest.mark.django_db
def test_should_return_rhymes_from_word_rhyming_without_cmu(create_database_rhymes_3):
    word_to_be_analysed, language_tag = "rhyming", "en-gb"

    rhymes = discover_rhymes(word_to_be_analysed, language_tag)

    assert rhymes == ["roaming", "rooming", "climbing", "diming", "liming", "priming", "scheming", "timing"]


@pytest.mark.django_db
def test_should_return_rhymes_from_word_solicitation_without_cmu():
    cmu_dict_content = """
        SOLICITATION  S AH0 L IH2 S IH0 T EY1 SH AH0 N
        STAGFLATION  S T AE0 G F L EY1 SH AH0 N
        STAGNATION  S T AE0 G N EY1 SH AH0 N
        STARVATION  S T AA0 R V EY1 SH AH0 N
        STATION  S T EY1 SH AH0 N
    """
    word_to_be_analysed, language_tag = "solicitation", "en-gb"
    create_database_from_fake_cmu_content(cmu_dict_content, language_tag)

    rhymes = discover_rhymes(word_to_be_analysed, language_tag)

    assert rhymes == ["stagflation", "stagnation", "starvation", "station"]


@pytest.mark.django_db
def test_should_return_homophones_from_word_their(create_database_homophones_1):
    word_to_be_analysed, language_tag = "their", "en-us"

    homophones = discover_homophones(word_to_be_analysed, language_tag)

    assert len(homophones) == 2
    homophone_1 = homophones[0]
    homophone_2 = homophones[1]
    assert homophone_1.word_or_symbol == "there"
    assert homophone_1.phonemic == "ð ɛ ɹ"
    assert homophone_2.word_or_symbol == "they're"
    assert homophone_2.phonemic == "ð ɛ ɹ"


@pytest.mark.django_db
def test_should_return_homophones_from_word_eight(create_database_homophones_2):
    word_to_be_analysed, language_tag = "eight", "en-us"

    homophones = discover_homophones(word_to_be_analysed, language_tag)

    assert len(homophones) == 2
    homophone_1 = homophones[0]
    homophone_2 = homophones[1]
    assert homophone_1.word_or_symbol == "ate"
    assert homophone_1.phonemic == "eɪ t"
    assert homophone_2.word_or_symbol == "aydt"
    assert homophone_2.phonemic == "eɪ t"
