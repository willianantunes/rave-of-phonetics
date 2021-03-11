import re

from collections import deque
from dataclasses import dataclass
from typing import Deque
from typing import List

from rave_of_phonetics.apps.core.business.exceps import MoreThanOneARPABETStressMarkException


@dataclass(frozen=True)
class ARPABETSyllableDetails:
    syllables: List[List[str]]
    count: int


@dataclass(frozen=True)
class IPAConversionDetails:
    arpabet_format: List[str]
    arpabet_syllable: List[List[str]]
    ipa_format: List[str]
    ipa_syllable: List[List[str]]


# https://en.m.wikipedia.org/wiki/ARPABET
# https://en.wikipedia.org/wiki/International_Phonetic_Alphabet
# http://english.glendale.cc.ca.us/phonics.rules.html
class InternationalPhoneticAlphabet:
    arpabet_phones = {
        "aa": "vowel",
        "ae": "vowel",
        "ah": "vowel",
        "ao": "vowel",
        "aw": "vowel",
        "ay": "vowel",
        "b": "stop",
        "ch": "affricate",
        "d": "stop",
        "dh": "fricative",
        "eh": "vowel",
        "er": "vowel",
        "ey": "vowel",
        "f": "fricative",
        "g": "stop",
        "hh": "aspirate",
        "ih": "vowel",
        "iy": "vowel",
        "jh": "affricate",
        "k": "stop",
        "l": "liquid",
        "m": "nasal",
        "n": "nasal",
        "ng": "nasal",
        "ow": "vowel",
        "oy": "vowel",
        "p": "stop",
        "r": "liquid",
        "s": "fricative",
        "sh": "fricative",
        "t": "stop",
        "th": "fricative",
        "uh": "vowel",
        "uw": "vowel",
        "v": "fricative",
        "w": "semivowel",
        "y": "semivowel",
        "z": "fricative",
        "zh": "fricative",
    }
    arpabet_hiatus = [
        ["er", "iy"],
        ["iy", "ow"],
        ["uw", "ow"],
        ["iy", "ah"],
        ["iy", "ey"],
        ["uw", "eh"],
        ["er", "eh"],
    ]
    arpabet_to_ipa = {
        "a": "ə",
        "ey": "eɪ",
        "aa": "ɑ",
        "ae": "æ",
        "ah": "ə",
        "ao": "ɔ",
        "aw": "aʊ",
        "ay": "aɪ",
        "b": "b",
        "ch": "ʧ",
        "dh": "ð",
        "d": "d",
        "eh": "ɛ",
        "er": "ər",
        "f": "f",
        "g": "ɡ",
        "hh": "h",
        "ih": "ɪ",
        "jh": "ʤ",
        "k": "k",
        "l": "l",
        "n": "n",
        "ng": "ŋ",
        "ow": "oʊ",
        "oy": "ɔɪ",
        "p": "p",
        "r": "ɹ",
        "sh": "ʃ",
        "t": "t",
        "th": "θ",
        "uh": "ʊ",
        "uw": "u",
        "v": "v",
        "w": "w",
        "zh": "ʒ",
        "iy": "i",
        "s": "s",
        "m": "m",
        "y": "j",
        "z": "z",
    }
    arpabet_stress_mark_to_ipa = {
        "1": "ˈ",
        "2": "ˌ",
    }
    regex_to_clean_arpabet_and_ipa_stress_mark = (
        fr"[\d{arpabet_stress_mark_to_ipa['1']}{arpabet_stress_mark_to_ipa['2']}]"
    )
    regex_to_capture_ipa_stress_mark = fr"([\{arpabet_stress_mark_to_ipa['1']}\{arpabet_stress_mark_to_ipa['2']}])"

    @classmethod
    def arpabet_syllable_count(cls, phonemes: List[str]) -> ARPABETSyllableDetails:
        # Stress should be wipe out!
        cleaned_phonemes = [cls._erase_stress_from_arpabet_phoneme(phoneme) for phoneme in phonemes]
        # This will indicate how many syllable all the phonemes has
        nuclei_count = 0
        # How to split it
        splitter = []

        for index, current_phoneme in enumerate(cleaned_phonemes):
            if cls.arpabet_phones[current_phoneme] == "vowel":
                first_iteration = index == 0

                if first_iteration:
                    splitter.append(index)
                    nuclei_count += 1
                else:
                    previous_phoneme = cleaned_phonemes[index - 1]
                    previous_phoneme_type = cls.arpabet_phones[previous_phoneme]
                    previous_phoneme_type_is_not_vowel = not previous_phoneme_type == "vowel"

                    if previous_phoneme_type_is_not_vowel:
                        splitter.append(index - 1)
                        nuclei_count += 1
                    elif [previous_phoneme, current_phoneme] in cls.arpabet_hiatus:
                        splitter.append(index)
                        nuclei_count += 1

        if len(splitter) > 1:
            # Naive implementation!
            # The first value is not needed
            which_parts_should_be_split = splitter[1::]
            first_syllable_slice = which_parts_should_be_split[0]
            first_part = phonemes[0:first_syllable_slice]
            parts = [first_part]
            for index, part_to_split in enumerate(which_parts_should_be_split):
                if index == len(which_parts_should_be_split) - 1:
                    parts.append(phonemes[part_to_split::])
                else:
                    part_to_split_which_is_ahead = which_parts_should_be_split[index + 1]
                    parts.append(phonemes[part_to_split:part_to_split_which_is_ahead])
        else:
            # That means that the input is the syllable itself
            parts = [phonemes]

        return ARPABETSyllableDetails(parts, nuclei_count)

    @classmethod
    def apply_ipa_stress_marks_to_arpabet_phoneme(cls, phonemes: List[str]) -> List[str]:
        clusters = ["sp", "st", "sk", "fr", "fl"]
        # Stop searching for where stress starts if these are encountered
        stop_set = ["nasal", "fricative", "vowel"]

        syllable_details = cls.arpabet_syllable_count(phonemes)
        eligible_to_apply_ipa_stress = syllable_details.count > 1
        if not eligible_to_apply_ipa_stress:
            return [cls._erase_stress_from_arpabet_phoneme(phoneme) for phoneme in phonemes]
        else:
            updated_phonemes: Deque = deque()
            for phoneme in phonemes:
                phoneme_last_char = phoneme[-1]
                phoneme_eligible_to_be_evaluated = phoneme_last_char in cls.arpabet_stress_mark_to_ipa.keys()
                if not phoneme_eligible_to_be_evaluated:
                    updated_phonemes.append(cls._erase_stress_from_arpabet_phoneme(phoneme))
                else:
                    all_matches = re.findall(r"\d", phoneme)
                    if len(all_matches) > 1:
                        raise MoreThanOneARPABETStressMarkException
                    arpabet_stress_mark = all_matches[0]
                    ipa_symbol = cls.arpabet_stress_mark_to_ipa[arpabet_stress_mark]
                    # Given the array is empty, we can do the simple work
                    if not updated_phonemes:
                        cleaned_phoneme = cls._erase_stress_from_arpabet_phoneme(phoneme)
                        new_phoneme = f"{ipa_symbol}{cleaned_phoneme}"
                        updated_phonemes.append(new_phoneme)
                    else:
                        placed, hiatus = False, False
                        # Inverting to make the analysis easier
                        updated_phonemes.reverse()
                        for index, updated_phoneme in enumerate(updated_phonemes):
                            not_first_iteration = index > 0
                            # Deal with updated_phoneme
                            cleaned_updated_phoneme = cls._clean_all_stress_marks(updated_phoneme)
                            cleaned_updated_phoneme_type = cls.arpabet_phones[cleaned_updated_phoneme]
                            # Deal with previous phoneme
                            previous_updated_phoneme = updated_phonemes[index - 1]
                            cleaned_previous_updated_phoneme = cls._clean_all_stress_marks(previous_updated_phoneme)
                            cleaned_previous_updated_phoneme_type = cls.arpabet_phones[cleaned_previous_updated_phoneme]
                            # Eligibility rules
                            first_eligibility = cleaned_updated_phoneme_type in stop_set
                            second_eligibility = not_first_iteration and cleaned_previous_updated_phoneme_type == "stop"
                            third_eligibility = cleaned_updated_phoneme in ["er", "w"]

                            if first_eligibility or second_eligibility or third_eligibility:
                                conjunction = f"{cleaned_updated_phoneme}{cleaned_previous_updated_phoneme}"
                                if conjunction in clusters:
                                    updated_phonemes[index] = ipa_symbol + updated_phonemes[index]
                                elif not cleaned_previous_updated_phoneme_type == "vowel" and not_first_iteration:
                                    updated_phonemes[index - 1] = ipa_symbol + updated_phonemes[index - 1]
                                elif cleaned_updated_phoneme_type == "vowel":
                                    hiatus = True
                                    cleaned_phoneme = cls._erase_stress_from_arpabet_phoneme(phoneme)
                                    new_phoneme = f"{ipa_symbol}{cleaned_phoneme}"
                                    updated_phonemes.appendleft(new_phoneme)
                                else:
                                    updated_phonemes[index] = ipa_symbol + updated_phonemes[index]
                                placed = True
                                break
                        if not placed:
                            index_to_place_refreshed_phoneme = len(updated_phonemes) - 1
                            refreshed_phoneme = ipa_symbol + updated_phonemes[index_to_place_refreshed_phoneme]
                            updated_phonemes[index_to_place_refreshed_phoneme] = refreshed_phoneme
                        # Normal order
                        updated_phonemes.reverse()
                        if not hiatus:
                            cleaned_phoneme = cls._erase_stress_from_arpabet_phoneme(phoneme)
                            updated_phonemes.append(cleaned_phoneme)
            return list(updated_phonemes)

    @classmethod
    def ipa_format_from_arpabet(cls, phonemes: List[str]) -> IPAConversionDetails:
        swap_list = [("ˈər", "əˈr"), ("ˈie", "iˈe")]
        phonemes_as_ipa_symbols = []
        refreshed_phonemes = cls.apply_ipa_stress_marks_to_arpabet_phoneme(phonemes)

        for index, phoneme in enumerate(refreshed_phonemes):
            matches = list(re.finditer(cls.regex_to_capture_ipa_stress_mark, phoneme))
            if not matches:
                ipa_version = cls.arpabet_to_ipa[phoneme]
                phonemes_as_ipa_symbols.append(ipa_version)
            else:
                match = matches[0]
                mark_that_was_matched = match.group()
                phoneme_without_stress = phoneme[match.end() :]
                ipa_version = cls.arpabet_to_ipa[phoneme_without_stress]
                final_ipa_version = f"{mark_that_was_matched}{ipa_version}"
                phonemes_as_ipa_symbols.append(final_ipa_version)
        for to_compare, to_swap in swap_list:
            if not phonemes_as_ipa_symbols[0].startswith(to_compare):
                phonemes_as_ipa_symbols[0] = phonemes_as_ipa_symbols[0].replace(to_compare, to_swap)

        # Now let's get the syllable details using IPA format
        syllable_details = cls.arpabet_syllable_count(phonemes)
        ipa_syllables = []
        where_to_start = 0
        for syllable_part in syllable_details.syllables:
            ipa_syllable = []
            for index, arpabet_symbol in enumerate(syllable_part):
                ipa_syllable.append(phonemes_as_ipa_symbols[where_to_start + index])
                if index == len(syllable_part) - 1:
                    where_to_start = where_to_start + index + 1
                    ipa_syllables.append(ipa_syllable)

        return IPAConversionDetails(phonemes, syllable_details.syllables, phonemes_as_ipa_symbols, ipa_syllables)

    @staticmethod
    def _erase_stress_from_arpabet_phoneme(phoneme):
        return re.sub(r"\d", "", phoneme)

    @classmethod
    def _clean_all_stress_marks(cls, phoneme):
        return re.sub(cls.regex_to_clean_arpabet_and_ipa_stress_mark, "", phoneme)
