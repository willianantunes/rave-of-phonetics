import pytest

from rave_of_phonetics.apps.twitter.models import Setup
from rave_of_phonetics.apps.twitter.tasks import verify_mentions_and_send_transcription_if_required
from tests.support.models_utils import create_setup


@pytest.mark.django_db
def test_should_persist_latest_mention_id_after_verify_mention_has_completed(mocker):
    # Arrange
    create_setup()
    mocked_check_mentions = mocker.patch("rave_of_phonetics.apps.twitter.tasks.check_mentions")
    fake_latest_mention_id = 2
    mocked_check_mentions.return_value = fake_latest_mention_id
    mocked_rw_api_mock = mocker.patch("rave_of_phonetics.apps.twitter.tasks.generate_read_write_api")
    mocked_tweepy_api = mocker.MagicMock()
    mocked_rw_api_mock.return_value = mocked_tweepy_api
    # Act
    verify_mentions_and_send_transcription_if_required()
    # Assert
    assert Setup.latest_configuration().latest_mention_id == fake_latest_mention_id
