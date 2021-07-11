import tweepy

from rave_of_phonetics.apps.twitter.models import Setup
from rave_of_phonetics.apps.twitter.service.exceps import ConfigurationTwitterNotAvailableException
from rave_of_phonetics.settings import TWITTER_CONSUMER_KEY
from rave_of_phonetics.settings import TWITTER_CONSUMER_SECRET

_auth_handler = tweepy.OAuthHandler(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET)


def generate_read_write_api() -> tweepy.API:
    configuration = Setup.latest_configuration()

    if not configuration:
        raise ConfigurationTwitterNotAvailableException

    _auth_handler.set_access_token(configuration.access_token, configuration.access_token_secret)
    return tweepy.API(_auth_handler)


def generate_api_read_only() -> tweepy.API:
    return tweepy.API(_auth_handler)


def retrieve_text(status):
    # https://docs.tweepy.org/en/stable/extended_tweets.html#examples
    try:
        return status.full_text
    except AttributeError:
        return status.text
