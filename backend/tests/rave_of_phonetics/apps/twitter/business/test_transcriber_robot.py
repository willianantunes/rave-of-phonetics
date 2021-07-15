from unittest.mock import call

import pytest

from rave_of_phonetics.apps.twitter.business.transcriber_robot import TweetDetails
from rave_of_phonetics.apps.twitter.business.transcriber_robot import (
    _evaluate_tweet_and_retrieve_details_replied_status,
)
from rave_of_phonetics.apps.twitter.business.transcriber_robot import _evaluate_tweet_and_retrieve_details_tweet_itself
from rave_of_phonetics.apps.twitter.business.transcriber_robot import check_mentions
from rave_of_phonetics.apps.twitter.models import TranscribeTweet
from rave_of_phonetics.apps.twitter.service.twitter_api import generate_read_write_api
from rave_of_phonetics.apps.twitter.service.words import _hello_words
from tests.support.cmu_utils import create_database_from_fake_cmu_content
from tests.support.models_utils import create_setup
from tests.support.twitter_utils import create_tweet


def test_valid_tweet_itself():
    # Arrange
    sample_tweet_1 = "@raveofphonetics transcribe I would love this"
    sample_tweet_2 = "@raveofphonetics transcribe a"
    sample_tweet_3 = (
        "@raveofphonetics transcribe C'mon, you're going out with the guy! "
        "There's gotta be something wrong with him! Wait, does he eat chalk? "
        "Just, 'cause, I don't want her to go through what I went through with Carl. "
        "Okay, everybody relax. This is not even a date. "
        "It's just two people going out to dinner and not having sex."
    )
    sample_tweet_4 = "@raveofphonetics transcribe 😎 Frequently 🤔 asked 🥵 questions 🤬"
    sample_tweet_5 = "@raveofphonetics transcribe Rave, live Phonetics!"
    sample_tweet_6 = """@raveofphonetics transcribe Don't ever, if "you; please, ad-hoc 1989!"""
    sample_tweet_7 = """@raveofphonetics transcribe Until her father’s health"""
    sample_tweet_8 = """@raveofphonetics transcribe Until her father's health"""
    sample_tweet_9 = """@raveofphonetics transcribe We, are checking! here @"""
    # Act
    tweet_details_1 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_1)
    tweet_details_2 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_2)
    tweet_details_3 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_3)
    tweet_details_4 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_4)
    tweet_details_5 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_5)
    tweet_details_6 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_6)
    tweet_details_7 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_7)
    tweet_details_8 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_8)
    tweet_details_9 = _evaluate_tweet_and_retrieve_details_tweet_itself(sample_tweet_9)
    # Assert
    assert tweet_details_1 == TweetDetails(is_valid=True, words=["i", "would", "love", "this"])
    assert tweet_details_2 == TweetDetails(is_valid=True, words=["a"])
    assert tweet_details_3 == TweetDetails(
        is_valid=True,
        words=[
            "c'mon",
            "you're",
            "going",
            "out",
            "with",
            "the",
            "guy",
            "there's",
            "gotta",
            "be",
            "something",
            "wrong",
            "with",
            "him",
            "wait",
            "does",
            "he",
            "eat",
            "chalk",
            "just",
            "'cause",
            "i",
            "don't",
            "want",
            "her",
            "to",
            "go",
            "through",
            "what",
            "i",
            "went",
            "through",
            "with",
            "carl",
            "okay",
            "everybody",
            "relax",
            "this",
            "is",
            "not",
            "even",
            "a",
            "date",
            "it's",
            "just",
            "two",
            "people",
            "going",
            "out",
            "to",
            "dinner",
            "and",
            "not",
            "having",
            "sex",
        ],
    )
    assert tweet_details_4 == TweetDetails(
        is_valid=True, words=["😎", "frequently", "🤔", "asked", "🥵", "questions", "🤬"]
    )
    assert tweet_details_5 == TweetDetails(is_valid=True, words=["rave", "live", "phonetics"])
    assert tweet_details_6 == TweetDetails(
        is_valid=True, words=["don't", "ever", "if", "you", "please", "ad-hoc", "1989"]
    )
    assert tweet_details_7 == TweetDetails(is_valid=True, words=["until", "her", "father’s", "health"])
    assert tweet_details_8 == TweetDetails(is_valid=True, words=["until", "her", "father's", "health"])
    assert tweet_details_9 == TweetDetails(is_valid=True, words=["we", "are", "checking", "here", "@"])


def test_valid_tweet_replied_status():
    # Arrange
    sample_tweet_1 = "@Cockatiel @Rachel what is your problem"
    sample_tweet_2 = "I know that I haven't worked here very long"
    sample_tweet_3 = """I've taken soda out of my diet completely, and anyone who values their internal organs, or teeth, would do well to follow suit. 

So, let them change the flavor a thousand times. https://t.co/m0ETHgyWjR"""
    # Act
    tweet_details_1 = _evaluate_tweet_and_retrieve_details_replied_status(sample_tweet_1)
    tweet_details_2 = _evaluate_tweet_and_retrieve_details_replied_status(sample_tweet_2)
    tweet_details_3 = _evaluate_tweet_and_retrieve_details_replied_status(sample_tweet_3)
    # Assert
    assert tweet_details_1 == TweetDetails(is_valid=True, words=["what", "is", "your", "problem"])
    assert tweet_details_2 == TweetDetails(
        is_valid=True,
        words=["i", "know", "that", "i", "haven't", "worked", "here", "very", "long"],
    )
    assert tweet_details_3 == TweetDetails(
        is_valid=True,
        words=[
            "i've",
            "taken",
            "soda",
            "out",
            "of",
            "my",
            "diet",
            "completely",
            "and",
            "anyone",
            "who",
            "values",
            "their",
            "internal",
            "organs",
            "or",
            "teeth",
            "would",
            "do",
            "well",
            "to",
            "follow",
            "suit",
            "",
            "",
            "so",
            "let",
            "them",
            "change",
            "the",
            "flavor",
            "a",
            "thousand",
            "times",
        ],
    )


@pytest.mark.django_db
def test_should_check_mention_tweet_itself_and_not_tweet_when_invalid_message_scenario_1(mocker):
    # Arrange
    fake_latest_mention_id = 1
    mocked_tweepy_api = mocker.MagicMock()
    mocked_tweepy = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.tweepy")
    mocked_limit_handled = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.limit_handled")
    tweet_1 = create_tweet(2, "lorem ipsum", "1264199818563510274", "Aladdin", "aladdin")
    tweet_2 = create_tweet(3, "lorem ipsum", "1264199818563510274", "Aladdin", "aladdin")
    mocked_limit_handled.return_value = [tweet_1, tweet_2]
    # Act
    id_to_be_saved = check_mentions(mocked_tweepy_api, fake_latest_mention_id)
    # Assert
    assert id_to_be_saved == tweet_2.id
    assert mocked_tweepy_api.update_status.call_count == 0
    assert mocked_tweepy.Cursor.call_count == 1


@pytest.mark.django_db
def test_should_check_mention_tweet_itself_and_tweet_when_valid_message_scenario_1(mocker):
    # Arrange
    cmu_dict_content = """
        I  AY1
        WOULD  W UH1 D
        LOVE  L AH1 V
        THIS  DH IH1 S
        THIS(1)  DH IH0 S
    """
    create_database_from_fake_cmu_content(cmu_dict_content)
    fake_latest_mention_id = 1
    mocked_tweepy_api = mocker.MagicMock()
    mocked_tweepy = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.tweepy")
    mocked_limit_handled = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.limit_handled")
    tweet_1 = create_tweet(
        2, "@raveofphonetics transcribe I would love this", "1264199818563510274", "Aladdin", "aladdin"
    )
    mocked_limit_handled.return_value = [tweet_1]
    # Act
    id_to_be_saved = check_mentions(mocked_tweepy_api, fake_latest_mention_id)
    # Assert
    assert id_to_be_saved == tweet_1.id
    assert TranscribeTweet.objects.count() == 1
    persisted_transcribe_tweet: TranscribeTweet = TranscribeTweet.objects.first()
    persisted_transcribe_tweet.tweet_id = tweet_1.id
    persisted_transcribe_tweet.owner_screen_name = tweet_1.user.screen_name
    assert mocked_tweepy.Cursor.call_count == 1
    assert mocked_tweepy_api.update_status.call_count == 1
    # Assert message that was used to tweet
    calls = []
    expected_transcription = "aɪ wʊd ləv ðɪs"
    for hello_word in _hello_words:
        possible_message = f"@{tweet_1.user.screen_name} {hello_word}, {tweet_1.user.name}! Here's your transcription 🥰: {expected_transcription}"
        calls.append(call(status=possible_message, in_reply_to_status_id=tweet_1.id))
    actual_call = mocked_tweepy_api.update_status.call_args_list[0]
    assert any(actual_call == expected_call for expected_call in calls)


@pytest.mark.django_db
def test_should_check_mention_tweet_itself_and_tweet_when_valid_message_scenario_2(mocker):
    # Arrange
    cmu_dict_content = """
        I  AY1
        WOULD  W UH1 D
        LOVE  L AH1 V
        THIS  DH IH1 S
        THIS(1)  DH IH0 S
        WILL  W IH1 L
        WILL(1)  W AH0 L
    """
    create_database_from_fake_cmu_content(cmu_dict_content)
    fake_latest_mention_id = 1
    mocked_tweepy_api = mocker.MagicMock()
    mocked_tweepy = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.tweepy")
    mocked_limit_handled = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.limit_handled")
    tweet_1 = create_tweet(
        2, "@raveofphonetics transcribe I would love this", "1264199818563510274", "Aladdin", "aladdin"
    )
    tweet_2 = create_tweet(
        100, "@raveofphonetics Rajah was just playing with him", "5264199818563510278", "Jasmine", "jasmine"
    )
    tweet_3 = create_tweet(
        150,
        "@raveofphonetics transcribe If you will not bow before a sultan, then you will cower before a SORCERER!",
        "5264199818563510279",
        "Jafar",
        "jafar",
    )
    mocked_limit_handled.return_value = [tweet_1, tweet_2, tweet_3]
    # Act
    id_to_be_saved = check_mentions(mocked_tweepy_api, fake_latest_mention_id)
    # Assert
    assert id_to_be_saved == tweet_3.id
    assert TranscribeTweet.objects.count() == 2
    persisted_transcribe_tweet_1, persisted_transcribe_tweet_2 = TranscribeTweet.objects.all()
    persisted_transcribe_tweet_1.tweet_id = tweet_1.id
    persisted_transcribe_tweet_1.owner_screen_name = tweet_1.user.screen_name
    persisted_transcribe_tweet_2.tweet_id = tweet_3.id
    persisted_transcribe_tweet_2.owner_screen_name = tweet_3.user.screen_name
    assert mocked_tweepy.Cursor.call_count == 1
    assert mocked_tweepy_api.update_status.call_count == 2
    # Assert message that was used to tweet
    calls = []
    first_expected_transcription = "aɪ wʊd ləv ðɪs"
    second_expected_transcription = "if you wɪl not bow before a sultan then you wɪl cower before a sorcerer"
    for hello_word in _hello_words:
        possible_message_1 = f"@{tweet_1.user.screen_name} {hello_word}, {tweet_1.user.name}! Here's your transcription 🥰: {first_expected_transcription}"
        possible_message_2 = f"@{tweet_3.user.screen_name} {hello_word}, {tweet_3.user.name}! Here's your transcription 🥰: {second_expected_transcription}"
        calls.append(call(status=possible_message_1, in_reply_to_status_id=tweet_1.id))
        calls.append(call(status=possible_message_2, in_reply_to_status_id=tweet_3.id))
    actual_call_1 = mocked_tweepy_api.update_status.call_args_list[0]
    actual_call_2 = mocked_tweepy_api.update_status.call_args_list[1]
    assert any(actual_call_1 == expected_call for expected_call in calls)
    assert any(actual_call_2 == expected_call for expected_call in calls)


@pytest.mark.django_db
def test_should_check_mention_replied_status_and_tweet_when_valid_message_scenario_1(mocker):
    # Arrange
    cmu_dict_content = """
        I  AY1
        WOULD  W UH1 D
        LOVE  L AH1 V
        THIS  DH IH1 S
        THIS(1)  DH IH0 S
        WILL  W IH1 L
        WILL(1)  W AH0 L
    """
    create_database_from_fake_cmu_content(cmu_dict_content)
    fake_latest_mention_id = 1
    fake_in_reply_to_status_id = 41
    mocked_tweepy_api = mocker.MagicMock()
    tweet_fake_status = create_tweet(fake_in_reply_to_status_id, "I would love this", "1", "Jafar", "jafar")
    mocked_tweepy_api.get_status.return_value = tweet_fake_status
    mocked_tweepy = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.tweepy")
    mocked_limit_handled = mocker.patch("rave_of_phonetics.apps.twitter.business.transcriber_robot.limit_handled")
    tweet_1 = create_tweet(
        42, "@jafar @raveofphonetics transcribe", "2", "Aladdin", "aladdin", fake_in_reply_to_status_id
    )
    mocked_limit_handled.return_value = [tweet_1]
    # Act
    id_to_be_saved = check_mentions(mocked_tweepy_api, fake_latest_mention_id)
    # Assert
    assert id_to_be_saved == tweet_1.id
    assert TranscribeTweet.objects.count() == 1
    persisted_transcribe_tweet: TranscribeTweet = TranscribeTweet.objects.first()
    persisted_transcribe_tweet.tweet_id = tweet_1.id
    persisted_transcribe_tweet.owner_screen_name = tweet_1.user.screen_name
    assert mocked_tweepy.Cursor.call_count == 1
    assert mocked_tweepy_api.update_status.call_count == 1
    assert mocked_tweepy_api.get_status.call_count == 1
    mocked_tweepy_api.get_status.assert_called_with(tweet_fake_status.id, tweet_mode="extended")
    # Assert message that was used to tweet
    calls = []
    expected_transcription = "aɪ wʊd ləv ðɪs"
    for hello_word in _hello_words:
        possible_message = f"@{tweet_1.user.screen_name} {hello_word}, {tweet_1.user.name}! Here's your transcription 🥰: {expected_transcription}"
        calls.append(call(status=possible_message, in_reply_to_status_id=tweet_1.id))
    actual_call = mocked_tweepy_api.update_status.call_args_list[0]
    assert any(actual_call == expected_call for expected_call in calls)


@pytest.mark.skip("This should be executed manually")
@pytest.mark.django_db
def test_check_mentions_task():
    # Arrange
    create_setup("1353325111399612416-2EHx2gBIXR1zNAoIqqkBEc0MC2Qvrg", "1FHR2dUN1Qi3lDteUYkKofAx1NJ2Qmi09zJDmXcpx0qsP")
    api = generate_read_write_api()
    latest_mention_id = 1415686015323279363
    # Act
    id_to_be_saved = check_mentions(api, latest_mention_id)
    # Assert
    assert id_to_be_saved
