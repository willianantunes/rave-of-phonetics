import json
import logging

from django.http import HttpResponse
from django.urls import reverse
from requests_oauthlib import OAuth2Session

from rave_of_phonetics.settings import GITHUB_OAUTH_APP_CLIENT_ID
from rave_of_phonetics.settings import GITHUB_OAUTH_APP_CLIENT_SECRET
from rave_of_phonetics.settings import GITHUB_OAUTH_APP_SCOPES
from rave_of_phonetics.settings import GITHUB_OAUTH_AUTHORIZATION_URL
from rave_of_phonetics.settings import GITHUB_OAUTH_ORIGIN
from rave_of_phonetics.settings import GITHUB_OAUTH_TOKEN_URL
from rave_of_phonetics.support.django_helpers import HttpResponseTemporaryRedirect

logger = logging.getLogger(__name__)

_provider = "github"


def index(request):
    _auth_endpoint = reverse("github-auth")

    html_content = f"""
        <h1>Hello my friend!</h1>
        <hr />
        <a href="/{_auth_endpoint}">Log in with {_provider.upper()}</a>
    """
    return HttpResponse(html_content)


def auth(request):
    logger.debug("Someone initiated GitHub OAuth web application flow!")
    session = OAuth2Session(GITHUB_OAUTH_APP_CLIENT_ID, scope=GITHUB_OAUTH_APP_SCOPES)
    authorization_url, state = session.authorization_url(GITHUB_OAUTH_AUTHORIZATION_URL)
    return HttpResponseTemporaryRedirect(authorization_url)


def callback(request):
    state_csrf = request.GET.get("state", None)
    authorization_response = request.build_absolute_uri().replace("http", "https")

    try:
        session = OAuth2Session(GITHUB_OAUTH_APP_CLIENT_ID, state=state_csrf, scope=GITHUB_OAUTH_APP_SCOPES)
        token = session.fetch_token(
            GITHUB_OAUTH_TOKEN_URL,
            client_secret=GITHUB_OAUTH_APP_CLIENT_SECRET,
            authorization_response=authorization_response,
        )
        access_token = token.get("access_token")
        content = {"token": access_token, "provider": _provider}
        content = json.dumps(content)
        message = "success"
    except Exception as e:
        logger.exception("An error was caught during the process!")
        message = "error"
        content = str(e)

    post_message_with_content = f"authorization:{_provider}:{message}:{content}"
    post_message = f"authorizing:{_provider}"

    html_content = f"""
        <!DOCTYPE html>
        <html>
            <head>
                <script>
                    if (!window.opener) {{
                        window.opener = {{
                            postMessage: function(action, origin) {{
                                console.log(action, origin);
                            }}
                        }}
                    }}
                    (function() {{
                        const sendMessageToMainWindow = (e) => {{
                            console.log(`What has been received: ${{e}}`)
                            window.opener.postMessage(`{post_message_with_content}`, e.origin) 
                        }}
                        window.addEventListener("message", sendMessageToMainWindow, false)
                        targetOrigin = "{GITHUB_OAUTH_ORIGIN}"
                        window.opener.postMessage(`{post_message}`, targetOrigin) 
                    }})()
                </script>
            </head>
            <body>
            </body>
        </html>
    """

    return HttpResponse(html_content)
