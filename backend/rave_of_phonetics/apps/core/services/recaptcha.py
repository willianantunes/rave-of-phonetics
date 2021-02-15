import logging

from dataclasses import dataclass
from typing import List
from typing import Optional

from requests import RequestException
from rest_framework import status

from rave_of_phonetics.settings import RECAPTCHA_ENDPOINT
from rave_of_phonetics.support.http import requests_session

logger = logging.getLogger(__name__)


class UnexpectedServerBehavior(Exception):
    pass


@dataclass(frozen=True)
class Evaluation:
    success: bool
    challenge_timestamp: str
    hostname: str
    score: float
    action: str
    error_codes: Optional[List[str]]


def verify_user_response(secret_key: str, token: str, remote_ip: Optional[str] = None) -> Evaluation:
    data = {
        "secret": secret_key,
        "response": token,
    }

    if remote_ip:
        data["remoteip"]: remote_ip

    with requests_session() as r:
        try:
            response = r.post(RECAPTCHA_ENDPOINT, data=data)
            status_code = response.status_code
            if status_code == status.HTTP_200_OK:
                body = response.json()
                success, error_codes, challenge_timestamp, hostname, score, action = (
                    body["success"],
                    body.get("error-codes"),
                    body.get("challenge_ts"),
                    body.get("hostname"),
                    body.get("score"),
                    body.get("action"),
                )
                return Evaluation(success, challenge_timestamp, hostname, score, action, error_codes)
            else:
                logger.error(f"An error {status_code} was caught during processing. Raw details: {response.raw}")
                raise UnexpectedServerBehavior
        except RequestException as e:
            """
            See more details at: https://requests.readthedocs.io/en/latest/user/quickstart/#errors-and-exceptions
            """
            logger.error(f"A network, time-out or HTTP error was caught. Details: {e}")
            raise e
