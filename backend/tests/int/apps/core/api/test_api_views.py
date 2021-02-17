import requests


def test_should_return_200_if_internet_is_available(live_server):
    health_check_request_path = "/health-check"
    health_check_endpoint = f"{live_server.url}{health_check_request_path}"

    response = requests.get(health_check_endpoint)

    assert response.status_code == 200
    assert response.json() == {"internetAvailable": True}
