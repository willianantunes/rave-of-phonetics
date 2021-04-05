from django.contrib import admin
from django.urls import include
from django.urls import path
from rest_framework import routers

from rave_of_phonetics.apps.core.api import api_views
from rave_of_phonetics.apps.core.api import github_views
from rave_of_phonetics.apps.core.api.v1 import api_views as api_views_v1
from rave_of_phonetics.apps.core.api.v1 import standard_views as standard_views_v1
from rave_of_phonetics.apps.core.api.v2 import api_views as api_views_v2

router_v1 = routers.DefaultRouter(trailing_slash=False)
router_v1.register("suggestions", standard_views_v1.SuggestionViewSet, basename="suggestions_v1")

# Something to know worry about if this app scales out
# https://stackoverflow.com/a/40904241/3899136
router_unique = routers.DefaultRouter()
router_unique.registry.extend(router_v1.registry)

urlpatterns = [
    path("logos/", admin.site.urls),
    path("health-check", api_views.health_check, name="health-check"),
    path("github", github_views.index, name="github-index"),
    path("github/auth", github_views.auth, name="github-auth"),
    path("github/callback", github_views.callback, name="github-callback"),
    path("api/v1/transcribe", api_views_v1.transcribe, name="v1/transcribe"),
    path("api/v2/transcribe", api_views_v2.transcribe, name="v2/transcribe"),
    path("api/v1/", include(router_v1.urls)),
]
