from parsel import Selector


def test_should_return_home_page(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.context.template_name == "core/pages/home.html"

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Rave of Phonetics"


def test_should_return_home_page_with_phones_from_word(client):
    fake_data = {"text-to-be-transcribed": "something", "chosen-language": "en-us"}
    response = client.post("/", fake_data)

    assert response.status_code == 200
    assert response.context.template_name == "core/pages/home.html"
    assert response.context["transcription"] == [
        {"word": fake_data["text-to-be-transcribed"], "phone": "sʌmθɪŋ", "language": fake_data["chosen-language"]}
    ]


def test_should_return_home_page_with_phones_from_words(client):
    fake_data_1 = {"text-to-be-transcribed": "123 something must be avoided", "chosen-language": "en-us"}
    response_1 = client.post("/", fake_data_1)

    def assert_response(response):
        assert response.context["transcription"] == [
            {"language": "en-us", "phone": "wʌnhʌndɹɪd twɛnti θɹiː", "word": "123"},
            {"language": "en-us", "phone": "sʌmθɪŋ", "word": "something"},
            {"language": "en-us", "phone": "mʌst", "word": "must"},
            {"language": "en-us", "phone": "biː", "word": "be"},
            {"language": "en-us", "phone": "ɐvɔɪdᵻd", "word": "avoided"},
        ]
        assert response.status_code == 200
        assert response.context.template_name == "core/pages/home.html"

    assert_response(response_1)

    fake_data_2 = {"text-to-be-transcribed": "! 123  something must be   avoided !@#$ %", "chosen-language": "en-us"}
    response_2 = client.post("/", fake_data_2)

    assert_response(response_2)


def test_should_return_method_not_allowed(client):
    response = client.put("/")
    assert response.status_code == 405

    response = client.patch("/")
    assert response.status_code == 405
