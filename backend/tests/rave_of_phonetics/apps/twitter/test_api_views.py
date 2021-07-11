from http import HTTPStatus

import pytest
import requests

from django.urls import reverse

from rave_of_phonetics.apps.twitter.models import Setup
from tests.support.twitter_utils import create_user


@pytest.mark.skip("It depends on TWITTER_CONSUMER_KEY and TWITTER_CONSUMER_SECRET")
def test_should_redirect_to_twitter_to_ask_for_access_tokens(live_server):
    # Arrange
    twitter_auth_endpoint = reverse("twitter-auth")
    final_url = f"{live_server.url}{twitter_auth_endpoint}"
    # Act
    response = requests.get(final_url)
    # Assert
    assert response.status_code == 200
    assert len(response.history) == 1

    previous_request = response.history[0]
    assert previous_request.status_code == HTTPStatus.FOUND
    redirect_location = previous_request.headers["location"]
    assert redirect_location.startswith("https://api.twitter.com/oauth/authorize?oauth_token=")


@pytest.mark.django_db
def test_should_persist_what_is_retrieved_from_twitter_during_callback(client, mocker):
    # Arrange
    mocked_oauth_handler = mocker.patch("rave_of_phonetics.apps.twitter.api_views._auth_handler")
    mocked_tweepy = mocker.patch("rave_of_phonetics.apps.twitter.api_views.tweepy")
    mocked_api = mocker.MagicMock()
    fake_user = create_user("42", "aladdin", "AladdinAgrabah", "no, genie!")
    mocked_api.me.return_value = fake_user
    mocked_tweepy.API.return_value = mocked_api
    fake_twitter_request_token = "qwerty"
    fake_oauth_verifier = "cockatiel"
    session = client.session
    session["twitter_request_token"] = fake_twitter_request_token
    session.save()
    twitter_callback_endpoint = reverse("twitter-callback")
    mocked_oauth_handler.access_token = "at42"
    mocked_oauth_handler.access_token_secret = "ats42"
    # client
    response = client.get(twitter_callback_endpoint, {"oauth_verifier": fake_oauth_verifier})
    # Assert
    assert response.status_code == HTTPStatus.FOUND
    assert response.headers["location"] == "/logos/"
    mocked_oauth_handler.get_access_token.assert_called_with(fake_oauth_verifier)
    assert mocked_oauth_handler.request_token == {
        "oauth_token": fake_twitter_request_token,
        "oauth_token_secret": fake_oauth_verifier,
    }
    mocked_tweepy.API.assert_called_with(mocked_oauth_handler, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    mocked_api.me.assert_called_once()
    assert Setup.objects.count() == 1
    persisted_setup = Setup.objects.first()
    assert persisted_setup.user_id == fake_user.id_str
    assert persisted_setup.when_account_was_created == fake_user.created_at
    assert persisted_setup.name == fake_user.name
    assert persisted_setup.screen_name == fake_user.screen_name
    assert persisted_setup.description == fake_user.description
    assert persisted_setup.access_token == mocked_oauth_handler.access_token
    assert persisted_setup.access_token_secret == mocked_oauth_handler.access_token_secret
