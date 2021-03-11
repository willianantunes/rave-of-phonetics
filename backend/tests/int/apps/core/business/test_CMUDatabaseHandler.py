import pytest

from rave_of_phonetics.apps.core.business.CMUDatabaseHandler import CMUDatabaseHandler
from rave_of_phonetics.apps.core.business.CMUDatabaseHandler import Variant
from rave_of_phonetics.apps.core.business.exceps import DatabaseFileNotAvailable
from rave_of_phonetics.apps.core.business.exceps import MoreVariantsThanWhatIsSupportedException

from tests.resources.resource_loader import resource_location


def test_should_raise_exception_given_the_file_does_not_exist():
    fake_database_location = "agrabah-aladdin.txt"

    with pytest.raises(DatabaseFileNotAvailable):
        CMUDatabaseHandler(fake_database_location)


def test_should_extract_line_scenario_1():
    sample_line_1 = "LIVE  L AY1 V\n"
    cmu_line = CMUDatabaseHandler.extract_data(sample_line_1)

    assert cmu_line.word_or_symbol == "live"
    assert cmu_line.phonemes == "l ay1 v".split(" ")
    assert cmu_line.variant == Variant.V1


def test_should_extract_line_scenario_2():
    sample_line_1 = "LIVE(1)  L IH1 V\n"
    cmu_line = CMUDatabaseHandler.extract_data(sample_line_1)

    assert cmu_line.word_or_symbol == "live"
    assert cmu_line.phonemes == "l ih1 v".split(" ")
    assert cmu_line.variant == Variant.V2


def test_should_extract_line_scenario_3():
    sample_line_1 = "LUBRICANTS(2)  L UW1 B R AH0 K AH0 N S\n"
    cmu_line = CMUDatabaseHandler.extract_data(sample_line_1)

    assert cmu_line.word_or_symbol == "lubricants"
    assert cmu_line.phonemes == "l uw1 b r ah0 k ah0 n s".split(" ")
    assert cmu_line.variant == Variant.V3


def test_should_extract_line_scenario_4():
    sample_line_1 = "\tMEMPHIS(3)  M EH1 M P F IH0 S\t\n"
    cmu_line = CMUDatabaseHandler.extract_data(sample_line_1)

    assert cmu_line.word_or_symbol == "memphis"
    assert cmu_line.phonemes == "m eh1 m p f ih0 s".split(" ")
    assert cmu_line.variant == Variant.V4


def test_should_extract_line_scenario_5():
    sample_line_1 = "\t HER'S  HH ER1 Z    \t\n"
    cmu_line = CMUDatabaseHandler.extract_data(sample_line_1)

    assert cmu_line.word_or_symbol == "her's"
    assert cmu_line.phonemes == "hh er1 z".split(" ")
    assert cmu_line.variant == Variant.V1


def test_should_extract_line_scenario_6():
    cmu_line_1 = CMUDatabaseHandler.extract_data("A.'S  EY1 Z")
    assert cmu_line_1.word_or_symbol == "a.'s"
    assert cmu_line_1.phonemes == "ey1 z".split(" ")
    assert cmu_line_1.variant == Variant.V1

    cmu_line_2 = CMUDatabaseHandler.extract_data("A.D.  EY2 D IY1")
    assert cmu_line_2.word_or_symbol == "a.d."
    assert cmu_line_2.phonemes == "ey2 d iy1".split(" ")
    assert cmu_line_2.variant == Variant.V1


def test_should_raise_exception_given_line_has_insupported_variant():
    sample_line_1 = "\tMEMPHIS(4)  M EH1 M P F IH0 S\t\n"
    with pytest.raises(MoreVariantsThanWhatIsSupportedException):
        CMUDatabaseHandler.extract_data(sample_line_1)


def test_should_return_10_lines_as_the_others_are_invalid():
    sample_file = resource_location("sample-part-2-cmudict-0.7b.txt")

    carnegie_mellon_university_database = CMUDatabaseHandler(sample_file)
    lines = list(carnegie_mellon_university_database.retrieve_cmu_lines())

    assert len(lines) == 10


def test_should_retrieve_configured_lines():
    sample_file = resource_location("sample-part-3-cmudict-0.7b.txt")

    carnegie_mellon_university_database = CMUDatabaseHandler(sample_file)
    lines = list(carnegie_mellon_university_database.retrieve_cmu_lines())

    assert len(lines) == 2

    cmu_line_1 = lines[0]
    cmu_line_2 = lines[1]

    assert cmu_line_1.word_or_symbol == "a"
    assert cmu_line_1.phonemes == "ah0".split(" ")
    assert cmu_line_1.variant == Variant.V1

    assert cmu_line_2.word_or_symbol == "a"
    assert cmu_line_2.phonemes == "ey1".split(" ")
    assert cmu_line_2.variant == Variant.V2


def test_should_count_valid_lines():
    cmu_database = resource_location("cmudict-0.7b.txt")

    carnegie_mellon_university_database = CMUDatabaseHandler(cmu_database)

    number_of_current_lines = 134429
    invalid_header_lines = 126
    invalid_footer_lines = 5
    correct_count_of_valid_lines = number_of_current_lines - invalid_header_lines - invalid_footer_lines

    assert carnegie_mellon_university_database.number_of_valid_entries == correct_count_of_valid_lines


def test_should_handle_lines_with_two_and_three_white_spaces():
    cmu_database = resource_location("sample-part-4-cmudict-0.7b.txt")

    carnegie_mellon_university_database = CMUDatabaseHandler(cmu_database)
    lines = list(carnegie_mellon_university_database.retrieve_cmu_lines())

    assert len(lines) == 3
    for mcu_line in lines:
        assert len(mcu_line.phonemes) > 0
        for phoneme in mcu_line.phonemes:
            assert phoneme
