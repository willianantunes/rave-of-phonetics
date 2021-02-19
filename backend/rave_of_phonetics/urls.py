from django.urls import path

from rave_of_phonetics.apps.core.api import api_views
from rave_of_phonetics.apps.core.api.v1 import api_views as v1

urlpatterns = [
    path("health-check", api_views.health_check, name="health-check"),
    path("api/v1/transcribe", v1.transcribe, name="v1/transcribe"),
]
