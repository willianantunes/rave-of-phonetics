import logging

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.request import Request
from rest_framework.response import Response

from rave_of_phonetics.apps.core.api.api_exception import EmptyBodyException
from rave_of_phonetics.apps.core.api.permissions import IsValidRecaptcha
from rave_of_phonetics.apps.core.business.transcriber import text_to_transcription

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsValidRecaptcha])
def transcribe(request: Request) -> Response:
    body = request.data

    if not body:
        raise EmptyBodyException

    # TODO: Should return 400 if the contract is not valid
    transcription = text_to_transcription(body["text"], body["with-stress"], body["language"])
    logger.debug(f"Transcription: {transcription}")

    return Response({"transcription": transcription})
