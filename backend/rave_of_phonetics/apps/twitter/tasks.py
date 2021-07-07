import logging

from rave_of_phonetics.apps.twitter.business.transcriber_robot import check_mentions
from rave_of_phonetics.apps.twitter.models import Setup
from rave_of_phonetics.apps.twitter.service.twitter_api import generate_read_write_api

logger = logging.getLogger(__name__)


def verify_mentions_and_send_transcription_if_required() -> None:
    api = generate_read_write_api()

    setup = Setup.latest_configuration()
    latest_mention_id = setup.latest_mention_id
    logger.info(f"Starting job from mention id: {latest_mention_id}")

    latest_mention_id = check_mentions(api, latest_mention_id)
    setup.latest_mention_id = latest_mention_id
    logger.info(f"Saving setup with newest latest id: {latest_mention_id}")
    setup.save()
