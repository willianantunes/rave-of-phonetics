import requests

from parsel import Selector


def test_should_return_custom_404_page(client):
    response = client.get("/jafar-wishes-to-be-the-most-powerful-sorcerer-in-the-world")

    assert response.status_code == 404
    assert response.context.template_name == "core/errors/404.html"

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Error 404"


def test_should_return_custom_500_page(live_server, mocker):
    mocked_index = mocker.patch("rave_of_phonetics.apps.core.views.index")
    mocked_index.side_effect = Exception()
    response = requests.get(f"{live_server.url}")

    assert response.status_code == 500

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Error 500"
