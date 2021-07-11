import logging

from django.contrib import admin

from rave_of_phonetics.apps.twitter.models import Setup
from rave_of_phonetics.support.django_helpers import CustomModelAdminMixin

logger = logging.getLogger(__name__)


@admin.register(Setup)
class SetupAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    pass
