from unittest import mock
from unittest.mock import call

import pytest

from rave_of_phonetics.apps.core.api import permissions
from rave_of_phonetics.apps.core.services.recaptcha import Evaluation
from rave_of_phonetics.settings import RECAPTCHA_SECRET_KEY
from tests.support.models_utils import create_language
from tests.support.tests_utils import Any


def test_should_suggestion_view_set_use_custom_permission_with_recaptcha_evaluation(client):
    header = {"HTTP_RECAPTCHA_TOKEN_V3": "fake-token"}

    with mock.patch.object(permissions, "verify_user_response", wraps=permissions.verify_user_response) as wrapped:
        response = client.post("/api/v1/suggestions", content_type="application/json", **header)

        result = response.json()

        assert response.status_code == 403
        assert result["detail"] == "You are not authorized 😬"

        wrapped.assert_called_once_with(RECAPTCHA_SECRET_KEY, header["HTTP_RECAPTCHA_TOKEN_V3"], Any(str))


@pytest.mark.django_db
def test_should_suggestion_view_set_return_400_given_invalid_suggestion(client, mocker):
    mocked_verify = mocker.patch("rave_of_phonetics.apps.core.api.permissions.verify_user_response")
    mocked_verify.return_value = Evaluation(True, "", "", 0.5, "", None)

    header = {"HTTP_RECAPTCHA_TOKEN_V3": "fake-token"}
    body_1 = {
        # As max length is 45
        "word_or_symbol": "pneumonoultramicroscopicsilicovolcanoconiosis1",
        "language_tag": "en-us",
    }
    body_2 = {
        # word_or_symbol must be present
        # language_tag must be present
    }
    body_3 = {
        # either ipa_phonemic or ipa_phonetic must be present
        "word_or_symbol": "pneumonoultramicroscopicsilicovolcanoconiosis",
        "language_tag": "pt-br",
    }

    response_1 = client.post("/api/v1/suggestions", content_type="application/json", data=body_1, **header)
    result_1 = response_1.json()
    assert response_1.status_code == 400
    assert result_1 == {"word_or_symbol": ["Ensure this field has no more than 45 characters."]}

    response_2 = client.post("/api/v1/suggestions", content_type="application/json", data=body_2, **header)
    result_2 = response_2.json()
    assert response_2.status_code == 400
    assert result_2 == {"language_tag": ["This field is required."], "word_or_symbol": ["This field is required."]}

    response_3 = client.post("/api/v1/suggestions", content_type="application/json", data=body_3, **header)
    result_3 = response_3.json()
    assert response_3.status_code == 400
    assert result_3 == {
        "ipa_phonemic or ipa_phonetic": ["At least one field should be provided"],
        "language_tag": ["Language tag not supported"],
    }

    calls = [call(RECAPTCHA_SECRET_KEY, header["HTTP_RECAPTCHA_TOKEN_V3"], Any(str)) for _ in range(3)]
    mocked_verify.assert_has_calls(calls)


@pytest.mark.django_db
def test_should_suggestion_view_set_save_suggestion(client, mocker):
    header = {"HTTP_RECAPTCHA_TOKEN_V3": "fake-token"}
    body = {
        "word_or_symbol": "theoretically",
        "explanation": "I think this phonemic is better when I compare with what I am receiving from RoP",
        "ipa_phonemic": "θiəɹɛɾɪkli",
        "language_tag": "en-us",
    }

    create_language("en-us")
    mocked_verify = mocker.patch("rave_of_phonetics.apps.core.api.permissions.verify_user_response")
    mocked_verify.return_value = Evaluation(True, "", "", 0.5, "", None)

    response = client.post("/api/v1/suggestions", content_type="application/json", data=body, **header)

    result = response.json()

    additional_fields = {"ipa_phonetic": None}
    assert response.status_code == 201
    assert result == {**additional_fields, **body}

    mocked_verify.assert_called_once_with(RECAPTCHA_SECRET_KEY, header["HTTP_RECAPTCHA_TOKEN_V3"], Any(str))
