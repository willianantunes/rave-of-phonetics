import logging

from django.core.handlers.wsgi import WSGIRequest
from rest_framework.decorators import api_view
from rest_framework.decorators import parser_classes
from rest_framework.decorators import renderer_classes
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from rave_of_phonetics.apps.core.api.api_exception import EmptyBodyException
from rave_of_phonetics.apps.core.api.api_exception import InvalidContractException
from rave_of_phonetics.apps.core.api.api_exception import UnauthorizedException
from rave_of_phonetics.apps.core.business.transcriber import text_to_transcription
from rave_of_phonetics.apps.core.services.recaptcha import verify_user_response
from rave_of_phonetics.settings import RECAPTCHA_SCORE_THRESHOLD
from rave_of_phonetics.settings import RECAPTCHA_SECRET_KEY
from rave_of_phonetics.settings import RECAPTCHA_TOKEN_HEADER
from rave_of_phonetics.support.http import user_ip_address

logger = logging.getLogger(__name__)


@api_view(["POST"])
@renderer_classes([JSONRenderer])
@parser_classes([JSONParser])
def transcribe(request: WSGIRequest):
    token = request.headers.get(RECAPTCHA_TOKEN_HEADER)

    if not token:
        logger.warning("Why the token is missing?")
        raise InvalidContractException

    body = request.data

    if not body:
        raise EmptyBodyException

    ip_address = user_ip_address(request)
    evaluation = verify_user_response(RECAPTCHA_SECRET_KEY, token, ip_address)
    logger.debug(f"ReCaptcha evaluation: {evaluation}")

    if evaluation.score and evaluation.score >= RECAPTCHA_SCORE_THRESHOLD:
        transcription = text_to_transcription(body["text"], body["with-stress"], body["language"])
        logger.debug(f"Transcription: {transcription}")
        return Response({"transcription": transcription})
    else:
        raise UnauthorizedException
