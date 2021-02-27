import pytest
import requests

from rest_framework import status


def test_should_redirect_to_oauth_provider_given_auth_initiation(live_server):
    fake_request_auth = "/github/auth?provider=github&site_id=jafar&scope=repo"

    response = requests.get(f"{live_server.url}{fake_request_auth}", allow_redirects=False)

    assert response.status_code == status.HTTP_307_TEMPORARY_REDIRECT
    part_of_redirected_url = "https://github.com/login/oauth/authorize?response_type=code&client_id="
    assert response.headers["Location"].startswith(part_of_redirected_url)


@pytest.mark.skip("As a means to be executed manually")
def test_should_inform_error_given_code_passed_is_incorrect(live_server):
    fake_request_callback = "/github/callback?code=22a5740226c01944e9a3&state=puVOSCHC3J1fsLlnO9pkFEHAo2C6VC"

    response = requests.get(f"{live_server.url}{fake_request_callback}")

    post_message = "`authorization:github:error:(bad_verification_code) The code passed is incorrect or expired.`"

    assert response.status_code == 200
    assert post_message in response.text


@pytest.mark.skip("As a means to be executed manually")
def test_should_inform_success_given_flow_execution_was_success(live_server):
    fake_request_callback = "/github/callback?code=22a5740226c01944e9a3&state=puVOSCHC3J1fsLlnO9pkFEHAo2C6VC"

    response = requests.get(f"{live_server.url}{fake_request_callback}")

    post_message = (
        '`authorization:github:success:{"token": "4aac3dfadf0f3a6a25b89c38baac2ef748ad39da", "provider": "github"}`'
    )

    assert response.status_code == 200
    assert post_message in response.text
