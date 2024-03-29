import pytest

from rave_of_phonetics.apps.core.business.transcriber import DictionaryEntry
from rave_of_phonetics.apps.core.business.transcriber import Transcription
from rave_of_phonetics.apps.core.business.transcriber import check_and_retrieve_transcriptions
from rave_of_phonetics.apps.core.business.transcriber import text_to_transcription
from tests.support.cmu_utils import create_database_from_fake_cmu_content


@pytest.mark.django_db
def test_should_retrieve_transcription_from_database_scenario():
    cmu_dict_content = """
        RAVE  R EY1 V
        OF  AH1 V
        OF(1)  AH0 V
        PHONETICS  F AH0 N EH1 T IH0 K S
    """
    create_database_from_fake_cmu_content(cmu_dict_content)

    text = ["rave", "of", "phonetics"]
    transcription = check_and_retrieve_transcriptions(text)

    assert transcription == [
        Transcription(
            word="rave",
            entries=[
                DictionaryEntry(
                    classification="Undefined",
                    version="Version 1",
                    phonemic="ɹ eɪ v",
                    phonemic_syllables="ɹ eɪ v",
                    phonetic=None,
                    phonetic_syllables=None,
                )
            ],
        ),
        Transcription(
            word="of",
            entries=[
                DictionaryEntry(
                    classification="Undefined",
                    version="Version 1",
                    phonemic="ə v",
                    phonemic_syllables="ə v",
                    phonetic=None,
                    phonetic_syllables=None,
                )
            ],
        ),
        Transcription(
            word="phonetics",
            entries=[
                DictionaryEntry(
                    classification="Undefined",
                    version="Version 1",
                    phonemic="f ə ˈn ɛ t ɪ k s",
                    phonemic_syllables="f ə • ˈn ɛ • t ɪ k s",
                    phonetic=None,
                    phonetic_syllables=None,
                )
            ],
        ),
    ]
