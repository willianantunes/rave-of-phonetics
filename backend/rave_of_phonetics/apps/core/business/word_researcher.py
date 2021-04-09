import logging

from typing import List
from typing import Optional

from django.db import transaction

from rave_of_phonetics.apps.core.models import ResearchedWord

logger = logging.getLogger(__name__)


def persist_what_user_sought(words: List[str], language_tag: str, ip_address: Optional[str]) -> None:
    words_without_duplicates = set(words)

    logger.debug("Creating list of objects to be saved")
    objects_to_be_saved = []
    for word in words_without_duplicates:
        to_be_saved = ResearchedWord(word_or_symbol=word, language_tag=language_tag, ip_address=ip_address)
        objects_to_be_saved.append(to_be_saved)

    logger.debug(f"Number of objects to be saved: {len(objects_to_be_saved)}")
    with transaction.atomic():
        ResearchedWord.objects.bulk_create(objects_to_be_saved)
