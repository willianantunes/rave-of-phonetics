from rave_of_phonetics.apps.core.business.InternationalPhoneticAlphabet import InternationalPhoneticAlphabet


def test_should_count_syllables_for_arpabet_phonemes_scenario_1():
    phonemes_for_word_something = ["s", "ah1", "m", "th", "ih0", "ng"]
    syllable_details = InternationalPhoneticAlphabet.arpabet_syllable_count(phonemes_for_word_something)

    assert syllable_details.count == 2
    assert syllable_details.syllables == [["s", "ah1", "m"], ["th", "ih0", "ng"]]


def test_should_count_syllables_for_arpabet_phonemes_scenario_2():
    phonemes_for_word_solicitation = ["s", "ah0", "l", "ih2", "s", "ih0", "t", "ey1", "sh", "ah0", "n"]
    syllable_details = InternationalPhoneticAlphabet.arpabet_syllable_count(phonemes_for_word_solicitation)

    assert syllable_details.count == 5
    assert syllable_details.syllables == [["s", "ah0"], ["l", "ih2"], ["s", "ih0"], ["t", "ey1"], ["sh", "ah0", "n"]]


def test_should_count_syllables_for_arpabet_phonemes_scenario_3():
    phonemes_for_word_sold = ["s", "ow1", "l", "d"]
    syllable_details = InternationalPhoneticAlphabet.arpabet_syllable_count(phonemes_for_word_sold)

    assert syllable_details.count == 1
    assert syllable_details.syllables == [["s", "ow1", "l", "d"]]


def test_should_count_syllables_for_arpabet_phonemes_scenario_4():
    phonemes_for_word_caramel = ["k", "eh1", "r", "ah0", "m", "ah0", "l"]
    syllable_details = InternationalPhoneticAlphabet.arpabet_syllable_count(phonemes_for_word_caramel)

    assert syllable_details.count == 3
    assert syllable_details.syllables == [["k", "eh1"], ["r", "ah0"], ["m", "ah0", "l"]]


def test_should_count_syllables_for_arpabet_phonemes_scenario_5():
    # The word "came" has 2 vowels, but the "e" is silent, leaving one vowel sound and 1 syllable
    phonemes_for_word_came = ["k", "ey1", "m"]
    syllable_details = InternationalPhoneticAlphabet.arpabet_syllable_count(phonemes_for_word_came)

    assert syllable_details.count == 1
    assert syllable_details.syllables == [["k", "ey1", "m"]]


def test_should_count_syllables_for_arpabet_phonemes_scenario_6():
    # The word "outside" has 4 vowels, but the "e" is silent and the "ou" is a diphthong which counts as only one sound,
    # so this word has only two vowels sounds and therefore, 2 syllables.
    phonemes_for_word_outside = ["aw1", "t", "s", "ay1", "d"]
    syllable_details = InternationalPhoneticAlphabet.arpabet_syllable_count(phonemes_for_word_outside)

    assert syllable_details.count == 2
    assert syllable_details.syllables == [["aw1", "t"], ["s", "ay1", "d"]]


def test_should_apply_stress_for_arpaned_phonemes_scenario_1():
    callable = InternationalPhoneticAlphabet.apply_ipa_stress_marks_to_arpabet_phoneme

    assert callable(["ah0"]) == ["ah"]
    assert callable(["ey1"]) == ["ey"]
    assert callable(["iy1", "ah0"]) == ["ˈiy", "ah"]
    assert callable(["aa1", "k", "er0"]) == ["ˈaa", "k", "er"]
    assert callable(["b", "iy1", "jh", "ey1"]) == ["ˈb", "iy", "ˈjh", "ey"]
    assert callable(["s", "ah1", "m", "th", "ih0", "ng"]) == ["ˈs", "ah", "m", "th", "ih", "ng"]
    assert callable(["ey1", "f", "ao1", "r", "t", "uw1", "w", "ah1", "n", "t", "uw1", "ey1", "t"]) == [
        "ˈey",
        "ˈf",
        "ao",
        "r",
        "ˈt",
        "uw",
        "ˈw",
        "ah",
        "n",
        "ˈt",
        "uw",
        "ˈey",
        "t",
    ]
    assert callable(["th", "iy2", "er0", "eh1", "t", "ih0", "k", "ah0", "l", "iy0"]) == [
        "ˌth",
        "iy",
        "er",
        "ˈeh",
        "t",
        "ih",
        "k",
        "ah",
        "l",
        "iy",
    ]


def test_should_transform_arpabet_to_ipa_scenario_1():
    arpabet_1_word_a42128 = ["ey1", "f", "ao1", "r", "t", "uw1", "w", "ah1", "n", "t", "uw1", "ey1", "t"]

    result = InternationalPhoneticAlphabet.ipa_format_from_arpabet(arpabet_1_word_a42128)

    assert result.arpabet_format == arpabet_1_word_a42128
    assert result.arpabet_syllable == [
        ["ey1"],
        ["f", "ao1", "r"],
        ["t", "uw1"],
        ["w", "ah1", "n"],
        ["t", "uw1", "ey1", "t"],
    ]
    assert result.ipa_format == ["ˈeɪ", "ˈf", "ɔ", "ɹ", "ˈt", "u", "ˈw", "ə", "n", "ˈt", "u", "ˈeɪ", "t"]
    assert result.ipa_syllable == [["ˈeɪ"], ["ˈf", "ɔ", "ɹ"], ["ˈt", "u"], ["ˈw", "ə", "n"], ["ˈt", "u", "ˈeɪ", "t"]]


def test_should_transform_arpabet_to_ipa_scenario_2():
    arpabet_word_something = ["s", "ah1", "m", "th", "ih0", "ng"]

    result = InternationalPhoneticAlphabet.ipa_format_from_arpabet(arpabet_word_something)

    assert result.arpabet_format == arpabet_word_something
    assert result.arpabet_syllable == [["s", "ah1", "m"], ["th", "ih0", "ng"]]
    assert result.ipa_format == ["ˈs", "ə", "m", "θ", "ɪ", "ŋ"]
    assert result.ipa_syllable == [["ˈs", "ə", "m"], ["θ", "ɪ", "ŋ"]]
