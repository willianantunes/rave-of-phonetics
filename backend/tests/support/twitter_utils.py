from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from django.utils import timezone


@dataclass(frozen=True)
class FakeTwitterUser:
    # https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/user
    id: int
    id_str: str
    name: str
    screen_name: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None


@dataclass(frozen=True)
class FakeTweet:
    id: int
    text: str
    user: FakeTwitterUser
    in_reply_to_status_id: Optional[int] = None


@dataclass(frozen=True)
class FakeUpdateStatus:
    # https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/tweet
    id: int


def create_tweet(
    tweet_id: int, tweet_text: str, user_id: str, user_name: str, screen_name: str, in_reply_to_status_id=None
) -> FakeTweet:
    twitter_user = FakeTwitterUser(int(user_id), user_id, user_name, screen_name)
    return FakeTweet(tweet_id, tweet_text, twitter_user, in_reply_to_status_id)


def create_tweet_status(tweet_id: int) -> FakeUpdateStatus:
    return FakeUpdateStatus(tweet_id)


def create_user(id_str: str, name: str, screen_name: str, description: str) -> FakeTwitterUser:
    return FakeTwitterUser(int(id_str), id_str, name, screen_name, description, timezone.now())
