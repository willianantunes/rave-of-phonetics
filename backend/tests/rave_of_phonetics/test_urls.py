from django.urls import reverse


def test_named_urls_are_resolved_to_the_correct_endpoints(client):
    # TODO: List all URLs configured and assert them
    admin_endpoint = reverse("admin:index")
    transcribe_endpoint = reverse("v1/transcribe")
    health_check_endpoint = reverse("health-check")
    twitter_auth_endpoint = reverse("twitter-auth")
    twitter_callback_endpoint = reverse("twitter-callback")
    # Why did I use "{basename}-list"
    # https://www.django-rest-framework.org/api-guide/routers/#defaultrouter
    suggestions_v1_endpoint = reverse("suggestions_v1-list")

    assert admin_endpoint == "/logos/"
    assert transcribe_endpoint == "/api/v1/transcribe"
    assert health_check_endpoint == "/health-check"
    assert twitter_auth_endpoint == "/twitter/auth/"
    assert twitter_callback_endpoint == "/twitter/callback/"
    assert suggestions_v1_endpoint == "/api/v1/suggestions"
