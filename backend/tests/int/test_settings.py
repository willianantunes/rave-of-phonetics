import requests


def test_should_redirect_with_www(settings, live_server):
    settings.PREPEND_WWW = True

    response = requests.get(f"{live_server.url}", allow_redirects=False)

    assert response.status_code == 301
    assert response.headers["Location"].startswith("http://www.localhost")
