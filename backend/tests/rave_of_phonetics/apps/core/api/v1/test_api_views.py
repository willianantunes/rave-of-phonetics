from rave_of_phonetics.apps.core.services.recaptcha import Evaluation


def test_should_return_403_token_is_fake_and_not_valid(client):
    body = {"text": "rave of phonetics", "language": "en-us", "with-stress": True}
    header = {
        "HTTP_RECAPTCHA_TOKEN_V3": "fake-token",
    }

    response = client.post("/api/v1/transcribe", content_type="application/json", data=body, **header)

    result = response.json()

    assert response.status_code == 403
    assert result["detail"] == "You are not authorized 😬"


def test_should_return_400_given_no_body_is_sent(client, mocker):
    mocked_verify_user_response = mocker.patch("rave_of_phonetics.apps.core.api.permissions.verify_user_response")
    mocked_verify_user_response.return_value = Evaluation(True, "", "", 0.5, "", None)
    header = {
        "HTTP_RECAPTCHA_TOKEN_V3": "fake-token",
    }

    response = client.post("/api/v1/transcribe", content_type="application/json", **header)

    result = response.json()

    assert response.status_code == 400
    assert result["detail"] == "You should send at least a body 😅, shouldn't you?"


def test_should_return_400_given_no_token_is_sent(client):
    response = client.post("/api/v1/transcribe", content_type="application/json")

    result = response.json()

    assert response.status_code == 400
    assert result["detail"] == "Do you know the contract? 🤔"


def test_should_receive_transcription(client, mocker):
    mocked_verify_user_response = mocker.patch("rave_of_phonetics.apps.core.api.permissions.verify_user_response")
    mocked_verify_user_response.return_value = Evaluation(True, "", "", 0.5, "", None)
    body = {"text": "rave of phonetics", "language": "en-us", "with-stress": True}
    header = {
        "HTTP_RECAPTCHA_TOKEN_V3": "fake-token",
    }

    response = client.post("/api/v1/transcribe", content_type="application/json", data=body, **header)
    result = response.json()

    assert response.status_code == 200
    assert result == {
        "transcription": [
            {"word": "rave", "phone": "ɹˈeɪv"},
            {"word": "of", "phone": "ˈʌv"},
            {"word": "phonetics", "phone": "fənˈɛɾɪks"},
        ]
    }
