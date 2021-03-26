import logging

from dataclasses import asdict

from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.request import Request
from rest_framework.response import Response

from rave_of_phonetics.apps.core.api.permissions import IsValidRecaptcha
from rave_of_phonetics.apps.core.api.v2.serializers import TranscriberSerializer
from rave_of_phonetics.apps.core.business.transcriber import check_and_retrieve_transcriptions

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsValidRecaptcha])
def transcribe(request: Request) -> Response:
    serializer = TranscriberSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    words, language = serializer.validated_data["words"], serializer.validated_data["language"]
    logger.debug(f"Number of words that will be evaluated considering {language}: {len(words)}")

    transcriptions = check_and_retrieve_transcriptions(words, language)
    logger.debug(f"Transcriptions: {transcriptions}")

    result = []
    for transcription in transcriptions:
        transcription_as_dict = asdict(transcription)
        result.append(transcription_as_dict)

    return Response(result)
