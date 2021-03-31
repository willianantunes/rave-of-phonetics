import pytest

from rave_of_phonetics.apps.core.services.recaptcha import Evaluation
from tests.support.cmu_utils import create_database_from_fake_cmu_content
from tests.support.models_utils import create_language


@pytest.fixture
def mock_recaptcha_verify(mocker):
    mocked_verify_user_response = mocker.patch("rave_of_phonetics.apps.core.api.permissions.verify_user_response")
    mocked_verify_user_response.return_value = Evaluation(True, "", "", 0.5, "", None)
    return mocked_verify_user_response


def test_should_return_403_token_is_fake_and_not_valid(client):
    body = {"text": "rave of phonetics", "language": "en-us"}
    header = {
        "HTTP_RECAPTCHA_TOKEN_V3": "fake-token",
    }

    response = client.post("/api/v2/transcribe", content_type="application/json", data=body, **header)

    result = response.json()

    assert response.status_code == 403
    assert result["detail"] == "You are not authorized 😬"


def test_should_return_400_given_no_body_is_sent(client, mock_recaptcha_verify):
    header = {
        "HTTP_RECAPTCHA_TOKEN_V3": "fake-token",
    }

    response = client.post("/api/v2/transcribe", content_type="application/json", **header)

    result = response.json()

    assert response.status_code == 400
    assert result == {"text": ["This field is required."], "language": ["This field is required."]}


@pytest.mark.django_db
def test_should_receive_empty_entries_as_the_words_does_not_exist_in_database(client, mock_recaptcha_verify):
    language = create_language("en-us")
    body = {"text": "rave of phonetics", "language": language.language_tag}
    header = {
        "HTTP_RECAPTCHA_TOKEN_V3": "fake-token",
    }

    response = client.post("/api/v2/transcribe", content_type="application/json", data=body, **header)
    result = response.json()

    assert response.status_code == 200
    assert result == [
        {"word": "rave", "entries": None},
        {"word": "of", "entries": None},
        {"word": "phonetics", "entries": None},
    ]


@pytest.mark.django_db
def test_should_receive_transcriptions(client, mock_recaptcha_verify):
    cmu_dict_content = """
        RAVE  R EY1 V
        OF  AH1 V
        OF(1)  AH0 V
        PHONETICS  F AH0 N EH1 T IH0 K S
    """
    create_database_from_fake_cmu_content(cmu_dict_content)
    body = {"text": "rave of phonetics", "language": "en-us"}
    header = {
        "HTTP_RECAPTCHA_TOKEN_V3": "fake-token",
    }

    response = client.post("/api/v2/transcribe", content_type="application/json", data=body, **header)
    result = response.json()

    assert response.status_code == 200
    assert result == [
        {
            "entries": [
                {
                    "classification": "Undefined",
                    "phonemic": "ɹ eɪ v",
                    "phonemic_syllables": "ɹ eɪ v",
                    "phonetic": None,
                    "phonetic_syllables": None,
                    "version": "Version 1",
                }
            ],
            "word": "rave",
        },
        {
            "entries": [
                {
                    "classification": "Undefined",
                    "phonemic": "ə v",
                    "phonemic_syllables": "ə v",
                    "phonetic": None,
                    "phonetic_syllables": None,
                    "version": "Version 1",
                },
                {
                    "classification": "Undefined",
                    "phonemic": "ə v",
                    "phonemic_syllables": "ə v",
                    "phonetic": None,
                    "phonetic_syllables": None,
                    "version": "Version 2",
                },
            ],
            "word": "of",
        },
        {
            "entries": [
                {
                    "classification": "Undefined",
                    "phonemic": "f ə ˈn ɛ t ɪ k s",
                    "phonemic_syllables": "f ə • ˈn ɛ • t ɪ k s",
                    "phonetic": None,
                    "phonetic_syllables": None,
                    "version": "Version 1",
                }
            ],
            "word": "phonetics",
        },
    ]
