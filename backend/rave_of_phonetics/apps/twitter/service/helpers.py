import logging
import time

import tweepy

logger = logging.getLogger(__name__)


def limit_handled(cursor, time_to_wait_given_rate_limit_error=5 * 60, stop_immediately=False):
    while True:
        try:
            yield next(cursor)
        except tweepy.RateLimitError:
            logger.warning("A tweepy.RateLimitError has been raised!")
            if stop_immediately:
                return
            else:
                time.sleep(time_to_wait_given_rate_limit_error)
        except StopIteration:
            return
