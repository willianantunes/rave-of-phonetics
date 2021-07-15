import logging
import random
import re

from dataclasses import dataclass
from time import sleep
from typing import List
from typing import Optional

import tweepy

from django.core.management import BaseCommand
from tweepy import TweepError

from rave_of_phonetics.apps.core.business.transcriber import check_and_retrieve_transcriptions
from rave_of_phonetics.apps.twitter.models import TranscribeTweet
from rave_of_phonetics.apps.twitter.service.helpers import limit_handled
from rave_of_phonetics.apps.twitter.service.twitter_api import retrieve_text
from rave_of_phonetics.apps.twitter.service.words import give_some_hello_word
from rave_of_phonetics.support.text_utils import strip_left_and_right_sides

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class TweetDetails:
    is_valid: bool
    words: Optional[List[str]] = None


regex_valid_tweet_to_transcribe_words_tweet_itself = re.compile(r"^.* ?@raveofphonetics transcribe (.*)$")
regex_valid_tweet_to_transcribe_words_from_replied_status = re.compile(r"^.* ?@raveofphonetics transcribe$")
regex_words_from_replied_status = re.compile(r"^(((?:@[a-zA-Z_\-0-9]+) )+)?(.+)$")
regex_negation_to_extract_words_and_emojis = re.compile(
    r"([^\w’'\-\u00a9\u00ae\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff])+"
)


def _extract_list_of_words_symbols(words: str):
    list_of_words = words.split(" ")
    list_of_cleaned_words = map(lambda v: v.lower(), map(strip_left_and_right_sides, list_of_words))
    list_of_tuple = [
        (regex_negation_to_extract_words_and_emojis.sub("", cleaned_word), cleaned_word)
        for cleaned_word in list_of_cleaned_words
    ]
    return [tuple_word[0] if tuple_word[0] else tuple_word[1] for tuple_word in list_of_tuple]


def _evaluate_tweet_and_retrieve_details_tweet_itself(tweet_text: str) -> TweetDetails:
    cleaned_tweet = strip_left_and_right_sides(tweet_text)
    match = re.match(regex_valid_tweet_to_transcribe_words_tweet_itself, cleaned_tweet)

    if not match:
        return TweetDetails(False)

    words = match.groups()[-1]
    list_of_valid_word_or_symbols = _extract_list_of_words_symbols(words)

    return TweetDetails(len(list_of_valid_word_or_symbols) > 0, list_of_valid_word_or_symbols)


def _evaluate_tweet_and_retrieve_details_replied_status(text: Optional[str]) -> TweetDetails:
    if not text:
        return TweetDetails(False)

    cleaned_text = strip_left_and_right_sides(text)
    match = regex_words_from_replied_status.match(cleaned_text)

    if not match:
        return TweetDetails(False)

    words = match.groups()[-1]
    list_of_valid_word_or_symbols = _extract_list_of_words_symbols(words)

    return TweetDetails(len(list_of_valid_word_or_symbols) > 0, list_of_valid_word_or_symbols)


def _tweet_with(api: tweepy.API, tweet_id: int, user_screen_name: str, user_name: str, tweet_details: TweetDetails):
    tweet_already_used = TranscribeTweet.objects.filter(tweet_id=tweet_id).exists()

    if tweet_already_used:
        # This maybe be a bug situation as well
        logger.warning(f"Tweet {tweet_id} by {user_name} has been used already. Let's avoid spam")
        return

    logger.debug("Creating tweet message")
    hello_word = give_some_hello_word()
    greetings = f"@{user_screen_name} {hello_word}, {user_name}"

    logger.debug("Building list of what words or symbols should be returned")
    words_to_be_returned = []
    transcriptions = check_and_retrieve_transcriptions(tweet_details.words)
    for index, transcription_details in enumerate(transcriptions):
        if transcription_details.entries:
            phonemic_transcription = transcription_details.entries[0].phonemic
            final_phonemic_transcription = phonemic_transcription.replace(" ", "")
            words_to_be_returned.append(final_phonemic_transcription)
        else:
            raw_word = tweet_details.words[index]
            words_to_be_returned.append(raw_word)

    logger.debug("Creating the final message until reaches the tweet text limit")
    # If it's too big, then we take one word out until the length is equal or less than 280
    placeholder_key = "#TRANSCRIPTION_PLACEHOLDER#"
    message_template = f"{greetings}! Here's your transcription 🥰: {placeholder_key}"
    tweeted = False
    for number_of_tags in range(len(words_to_be_returned), 0, -1):
        words_to_be_considered = words_to_be_returned[0:number_of_tags]
        joined_words = " ".join(words_to_be_considered)
        message = message_template.replace(placeholder_key, joined_words)
        if len(message) <= 280:
            logger.info(f"Tweet to be posted: {message}")
            try:
                status = api.update_status(status=message, in_reply_to_status_id=tweet_id)
                logger.debug(f"Received status details: {status}")
                TranscribeTweet.objects.create(owner_screen_name=user_screen_name, tweet_id=tweet_id)
                tweeted = True
                break
            except TweepError as e:
                # If the number of updates posted by the user reaches the current allowed limit
                # then update_status method will return an HTTP 403 error.
                if e.api_code == 403:
                    logger.warning("We received an error 403 from update_status")
                else:
                    logger.error(f"An unexpected error has been raised: {e}")
    if tweeted is False:
        logger.error(f"Something weird is happening! We couldn't tweet: {words_to_be_returned}")


def check_mentions(api: tweepy.API, since_id: int):
    new_since_id = since_id
    logger.debug("Retrieving mentions")

    # https://docs.tweepy.org/en/stable/extended_tweets.html
    # https://docs.tweepy.org/en/latest/api.html#tweepy.API.mentions_timeline
    for tweet in limit_handled(tweepy.Cursor(api.mentions_timeline, since_id=since_id, tweet_mode="extended").items()):
        new_since_id = max(tweet.id, new_since_id)
        user_name = tweet.user.name
        user_screen_name = tweet.user.screen_name
        text = retrieve_text(tweet)

        logger.info(f"Message from user {user_name}!")
        tweet_itself = _evaluate_tweet_and_retrieve_details_tweet_itself(text)

        if tweet_itself.is_valid:
            logger.info("Valid to be transcribed from tweet itself!")
            _tweet_with(api, new_since_id, user_screen_name, user_name, tweet_itself)

        logger.debug("Evaluating second case (replied status)")
        text_from_replied = None
        if regex_valid_tweet_to_transcribe_words_from_replied_status.match(text):
            status_details_from_replied = api.get_status(tweet.in_reply_to_status_id, tweet_mode="extended")
            logger.debug(f"Replied status: {status_details_from_replied}")
            text_from_replied = retrieve_text(status_details_from_replied)
        tweet_replied_status = _evaluate_tweet_and_retrieve_details_replied_status(text_from_replied)

        if tweet_replied_status.is_valid:
            logger.info("Valid to be transcribed from replied status!")
            _tweet_with(api, new_since_id, user_screen_name, user_name, tweet_replied_status)
    return new_since_id
