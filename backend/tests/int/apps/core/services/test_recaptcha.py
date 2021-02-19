from rave_of_phonetics.apps.core.services.recaptcha import verify_user_response
from rave_of_phonetics.settings import RECAPTCHA_SECRET_KEY


def test_should_return_error_given_token_is_fake():
    token_that_you_receive_from_the_user_on_front_end_side = "fake-token"

    evaluation = verify_user_response(RECAPTCHA_SECRET_KEY, token_that_you_receive_from_the_user_on_front_end_side)

    assert not evaluation.success
    assert len(evaluation.error_codes) == 1
    assert evaluation.error_codes == ["invalid-input-response"]
    assert evaluation.action is None
    assert evaluation.challenge_timestamp is None
    assert evaluation.hostname is None
    assert evaluation.score is None


def test_should_return_errors_given_secret_key_and_token_are_fake():
    secret_key = "fake-key"
    token_that_you_receive_from_the_user_on_front_end_side = "fake-token"

    evaluation = verify_user_response(secret_key, token_that_you_receive_from_the_user_on_front_end_side)

    assert not evaluation.success
    assert len(evaluation.error_codes) == 2
    assert evaluation.error_codes == ["invalid-input-response", "invalid-input-secret"]
    assert evaluation.action is None
    assert evaluation.challenge_timestamp is None
    assert evaluation.hostname is None
    assert evaluation.score is None
