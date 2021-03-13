from django.urls import reverse


def test_named_urls_are_resolved_to_the_correct_endpoints(client):
    transcribe_endpoint = reverse("v1/transcribe")
    health_check_endpoint = reverse("health-check")
    # Why did I use "{basename}-list"
    # https://www.django-rest-framework.org/api-guide/routers/#defaultrouter
    suggestions_v1_endpoint = reverse("suggestions_v1-list")

    assert transcribe_endpoint == "/api/v1/transcribe"
    assert health_check_endpoint == "/health-check"
    assert suggestions_v1_endpoint == "/api/v1/suggestions"
