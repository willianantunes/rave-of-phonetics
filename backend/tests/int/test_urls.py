import requests

from django.shortcuts import render
from parsel import Selector


def test_should_return_custom_400_page(client):
    fake_data = {"chosen-language": "fake-language"}
    response = client.post("/", fake_data)

    assert response.status_code == 400

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Error 400"


def test_should_return_custom_404_page(client):
    response = client.get("/jafar-wishes-to-be-the-most-powerful-sorcerer-in-the-world")

    assert response.status_code == 404
    assert len(response.context) > 0
    for item in response.context:
        assert item.template_name == "core/errors/404.html"

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Error 404"


def test_should_return_custom_500_page(live_server, mocker):
    mocked_render = mocker.patch("rave_of_phonetics.apps.core.views.render")

    def conditional_render(*args, **kwargs):
        if args[1] == "core/pages/home.html":
            raise Exception()
        return render(*args, **kwargs)

    mocked_render.side_effect = conditional_render
    response = requests.get(f"{live_server.url}")

    assert response.status_code == 500

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Error 500"
