import logging

from rest_framework import permissions

from rave_of_phonetics.apps.core.api.api_exception import InvalidContractException
from rave_of_phonetics.apps.core.services.recaptcha import verify_user_response
from rave_of_phonetics.settings import RECAPTCHA_SCORE_THRESHOLD
from rave_of_phonetics.settings import RECAPTCHA_SECRET_KEY
from rave_of_phonetics.settings import RECAPTCHA_TOKEN_HEADER
from rave_of_phonetics.support.http import user_ip_address

logger = logging.getLogger(__name__)


class IsValidRecaptcha(permissions.BasePermission):
    message = "You are not authorized 😬"

    def has_permission(self, request, view):
        token = request.headers.get(RECAPTCHA_TOKEN_HEADER)

        if not token:
            logger.warning("Why the token is missing?")
            raise InvalidContractException

        ip_address = user_ip_address(request)
        evaluation = verify_user_response(RECAPTCHA_SECRET_KEY, token, ip_address)
        logger.debug(f"ReCaptcha evaluation: {evaluation}")

        return evaluation.score and evaluation.score >= RECAPTCHA_SCORE_THRESHOLD
