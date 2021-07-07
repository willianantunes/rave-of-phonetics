from django.db import models

from rave_of_phonetics.apps.core.models import StandardModelMixin


class Setup(StandardModelMixin):
    user_id = models.CharField(max_length=32, null=False, blank=False)
    when_account_was_created = models.DateTimeField(null=False, blank=False)
    name = models.CharField(max_length=50, null=False, blank=False)
    screen_name = models.CharField(max_length=16, null=False, blank=False)
    description = models.CharField(max_length=255, null=False, blank=False)
    access_token = models.CharField(max_length=255, null=False, blank=False)
    access_token_secret = models.CharField(max_length=255, null=False, blank=False)
    latest_mention_id = models.PositiveBigIntegerField(default=1, null=False, blank=False)

    @classmethod
    def latest_configuration(cls):
        found_setup: Setup = Setup.objects.order_by("created_at").all()[:1].first()
        return found_setup


class TranscribeTweet(StandardModelMixin):
    owner_screen_name = models.CharField(max_length=16, null=False, blank=False)
    tweet_id = models.PositiveBigIntegerField(null=False, blank=False)
