import logging

from rest_framework.decorators import api_view
from rest_framework.decorators import parser_classes
from rest_framework.decorators import renderer_classes
from rest_framework.exceptions import UnsupportedMediaType
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from rave_of_phonetics.apps.core.api_exception import EmptyBodyException
from rave_of_phonetics.apps.core.business.transcriber import text_to_transcription

logger = logging.getLogger(__name__)

valid_media_type = "application/json"


@api_view(["POST"])
@renderer_classes([JSONRenderer])
@parser_classes([JSONParser])
def transcribe(request):
    try:
        body = request.data

        if not body:
            raise EmptyBodyException

        transcription = text_to_transcription(body["text"], body["with-stress"], body["language"])

        return Response({"transcription": transcription})
    except UnsupportedMediaType as e:
        # TODO when contract is broken, when a value is wrong, etc.
        logger.info(e)
        raise e
    except Exception as e:
        logger.info(e)
