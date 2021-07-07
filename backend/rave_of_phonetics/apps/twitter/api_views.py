import logging

from http import HTTPStatus

import tweepy

from django.http import HttpResponse
from django.shortcuts import redirect
from rest_framework.decorators import api_view

from rave_of_phonetics.apps.twitter.models import Setup
from rave_of_phonetics.settings import TWITTER_CONSUMER_KEY
from rave_of_phonetics.settings import TWITTER_CONSUMER_SECRET

logger = logging.getLogger(__name__)

_auth_handler = tweepy.OAuthHandler(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET)
_twitter_request_token_key = "twitter_request_token"


@api_view(["GET"])
def auth(request):
    try:
        redirect_url = _auth_handler.get_authorization_url()
        request.session[_twitter_request_token_key] = _auth_handler.request_token["oauth_token"]
        return redirect(redirect_url)
    except tweepy.TweepError as e:
        logger.error(f"Failed to get request token from Twitter! Check your setup! Reason: {e.reason}")
        return HttpResponse(status=HTTPStatus.SERVICE_UNAVAILABLE)


@api_view(["GET"])
def callback(request):
    try:
        logger.info("Retrieving request token and OAuth Verifier...")
        twitter_request_token = request.session[_twitter_request_token_key]
        del request.session[_twitter_request_token_key]
        verifier = request.GET.get("oauth_verifier")

        logger.info("Configuring access token...")
        _auth_handler.request_token = {"oauth_token": twitter_request_token, "oauth_token_secret": verifier}
        _auth_handler.get_access_token(verifier)

        logger.info("Done! Now getting user details and saving tokens in our database...")
        _api = tweepy.API(_auth_handler, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
        about_the_user_who_allowed = _api.me()

        Setup.objects.create(
            user_id=about_the_user_who_allowed.id,
            when_account_was_created=about_the_user_who_allowed.created_at,
            name=about_the_user_who_allowed.name,
            screen_name=about_the_user_who_allowed.screen_name,
            description=about_the_user_who_allowed.description,
            access_token=_auth_handler.access_token,
            access_token_secret=_auth_handler.access_token_secret,
        )

        return redirect("admin:index")
    except tweepy.TweepError as e:
        logger.error(f"Failed to get access token. Reason: {e.reason}")
        return HttpResponse(status=HTTPStatus.SERVICE_UNAVAILABLE)
