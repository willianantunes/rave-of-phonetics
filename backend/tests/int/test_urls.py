from django.urls import reverse


def test_named_urls_are_resolved_to_the_correct_endpoints(client):
    transcribe_endpoint = reverse("v1/transcribe")
    health_check_endpoint = reverse("health-check")

    assert transcribe_endpoint == "/api/v1/transcribe"
    assert health_check_endpoint == "/health-check"
