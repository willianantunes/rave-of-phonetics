import re

from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import Generator
from typing import List

from rave_of_phonetics.apps.core.business.exceps import DatabaseFileNotAvailable
from rave_of_phonetics.apps.core.business.exceps import MoreVariantsThanWhatIsSupportedException
from rave_of_phonetics.support.file_utils import each_line_from_file
from rave_of_phonetics.support.text_utils import strip_left_and_right_sides


class Variant(Enum):
    V1 = 1
    V2 = 2
    V3 = 3
    V4 = 4


@dataclass(frozen=True)
class CMULine:
    word_or_symbol: str
    phonemes: List[str]
    variant: Variant


# https://en.wikipedia.org/wiki/CMU_Pronouncing_Dictionary
class CMUDatabaseHandler:
    regex_for_variant = r"(\([0-9]\))"
    cmu_word_phoneme_separator = "  "
    cmu_buggy_word_phoneme_separator = "   "
    cmu_standard_phoneme_separator = " "

    def __init__(self, database_file_location):
        path = Path(database_file_location)
        if not (path.exists() and path.is_file()):
            raise DatabaseFileNotAvailable
        self.database_file_location = database_file_location

    @property
    def number_of_valid_entries(self):
        valid_lines = self.retrieve_valid_lines()
        return sum(1 for line in valid_lines)

    @classmethod
    def extract_data(cls, raw_line: str) -> CMULine:
        cleaned_line = strip_left_and_right_sides(raw_line.lower())

        if cls.cmu_buggy_word_phoneme_separator in cleaned_line:
            word_or_symbol, phonemes = cleaned_line.split(cls.cmu_buggy_word_phoneme_separator)
        else:
            word_or_symbol, phonemes = cleaned_line.split(cls.cmu_word_phoneme_separator)

        phonemes_as_list = phonemes.split(cls.cmu_standard_phoneme_separator)
        matches = list(re.finditer(cls.regex_for_variant, word_or_symbol))

        if not matches:
            return CMULine(word_or_symbol, phonemes_as_list, Variant.V1)
        else:
            match = matches[0]
            mark_that_was_matched = match.group()

            if "1" in mark_that_was_matched:
                variant_found = Variant.V2
            elif "2" in mark_that_was_matched:
                variant_found = Variant.V3
            elif "3" in mark_that_was_matched:
                variant_found = Variant.V4
            else:
                raise MoreVariantsThanWhatIsSupportedException

            word_or_symbol_without_variant_number = word_or_symbol[0 : match.start()]

            return CMULine(word_or_symbol_without_variant_number, phonemes_as_list, variant_found)

    def retrieve_cmu_lines(self) -> Generator[CMULine, None, None]:
        for valid_line in self.retrieve_valid_lines():
            yield self.extract_data(valid_line)

    def retrieve_valid_lines(self) -> Generator[str, None, None]:
        for line in each_line_from_file(self.database_file_location, "ISO-8859-1"):
            # Only words are supported for now. Symbols maybe in the future...
            if not re.match("^[a-zA-Z]", line):
                continue
            yield line
