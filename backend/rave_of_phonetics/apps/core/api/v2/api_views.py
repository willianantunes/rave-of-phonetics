import logging

from dataclasses import asdict

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.request import Request
from rest_framework.response import Response

from rave_of_phonetics.apps.core.api.permissions import IsValidRecaptcha
from rave_of_phonetics.apps.core.api.v2.serializers import TranscriberSerializer
from rave_of_phonetics.apps.core.business.transcriber import text_to_transcription

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsValidRecaptcha])
def transcribe(request: Request) -> Response:
    serializer = TranscriberSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    text, language = serializer.validated_data["text"], serializer.validated_data["language"]
    logger.debug(f"The following text will be evaluated considering {language}: {text}")

    transcriptions = text_to_transcription(text, language=language, through_database=True)
    logger.debug(f"Transcriptions: {transcriptions}")

    result = []
    for transcription in transcriptions:
        transcription_as_dict = asdict(transcription)
        result.append(transcription_as_dict)

    return Response(result)
