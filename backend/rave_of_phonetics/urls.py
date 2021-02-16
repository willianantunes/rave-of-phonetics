from django.urls import path

from rave_of_phonetics.apps.core.api.v1 import api_views

urlpatterns = [
    path("api/v1/transcribe", api_views.transcribe, name="transcribe"),
]
