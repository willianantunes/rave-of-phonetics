from django.urls import path

from rave_of_phonetics.apps.core import views

handler400 = "rave_of_phonetics.apps.core.views.handler400"
handler404 = "rave_of_phonetics.apps.core.views.handler404"
handler500 = "rave_of_phonetics.apps.core.views.handler500"

urlpatterns = [
    path("", views.index, name="index"),
    path("changelog/", views.changelog, name="changelog"),
]
