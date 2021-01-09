from parsel import Selector


def test_should_return_home_page(client):
    response = client.get("/")

    assert response.status_code == 200
    assert len(response.context) > 0
    for item in response.context:
        assert item.template_name == "core/pages/home.html"

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Rave of Phonetics"


def test_should_return_home_page_with_phones_from_word_given_language_en_us(client):
    fake_data = {"text-to-be-transcribed": "something", "chosen-language": "en-us"}
    response = client.post("/", fake_data)

    assert response.status_code == 200
    assert len(response.context) > 0
    for item in response.context:
        assert item.template_name == "core/pages/home.html"
    assert response.context["transcription"] == [{"word": fake_data["text-to-be-transcribed"], "phone": "sʌmθɪŋ"}]
    assert response.context["text"] == fake_data["text-to-be-transcribed"]
    assert response.context["language"] == fake_data["chosen-language"]
    number_of_params = len(response.context[0].dicts[-1])
    assert number_of_params == 3


def test_should_return_home_page_with_phones_from_words_given_language_en_us(client):
    fake_data_1 = {"text-to-be-transcribed": "123 something must be avoided", "chosen-language": "en-us"}
    response_1 = client.post("/", fake_data_1)

    def assert_response(response):
        assert response.context["transcription"] == [
            {"phone": "wʌnhʌndɹɪd twɛnti θɹiː", "word": "123"},
            {"phone": "sʌmθɪŋ", "word": "something"},
            {"phone": "mʌst", "word": "must"},
            {"phone": "biː", "word": "be"},
            {"phone": "ɐvɔɪdᵻd", "word": "avoided"},
        ]
        assert response.status_code == 200
        assert len(response.context) > 0
        for item in response.context:
            assert item.template_name == "core/pages/home.html"
        assert response.context["text"] == fake_data_1["text-to-be-transcribed"]
        assert response.context["language"] == fake_data_1["chosen-language"]
        number_of_params = len(response.context[0].dicts[-1])
        assert number_of_params == 3

    assert_response(response_1)

    fake_data_2 = {"text-to-be-transcribed": "! 123  something must be   avoided !@#$ %", "chosen-language": "en-us"}
    response_2 = client.post("/", fake_data_2)

    assert_response(response_2)


def test_should_return_home_page_with_phones_from_words_given_language_en_gb(client):
    fake_data_1 = {"text-to-be-transcribed": "123 something must be avoided", "chosen-language": "en-gb"}
    response_1 = client.post("/", fake_data_1)

    def assert_response(response):
        assert response.context["transcription"] == [
            {"phone": "wɒnhʌndɹɪdən twɛnti θɹiː", "word": "123"},
            {"phone": "sʌmθɪŋ", "word": "something"},
            {"phone": "mʌst", "word": "must"},
            {"phone": "biː", "word": "be"},
            {"phone": "ɐvɔɪdɪd", "word": "avoided"},
        ]
        assert response.status_code == 200
        assert len(response.context) > 0
        for item in response.context:
            assert item.template_name == "core/pages/home.html"
        assert response.context["text"] == fake_data_1["text-to-be-transcribed"]
        assert response.context["language"] == fake_data_1["chosen-language"]
        number_of_params = len(response.context[0].dicts[-1])
        assert number_of_params == 3

    assert_response(response_1)

    fake_data_2 = {"text-to-be-transcribed": "! 123  something must be   avoided !@#$ %", "chosen-language": "en-gb"}
    response_2 = client.post("/", fake_data_2)

    assert_response(response_2)


def test_should_return_method_not_allowed(client):
    response = client.put("/")
    assert response.status_code == 405

    response = client.patch("/")
    assert response.status_code == 405


def test_should_return_phonetics_even_with_break_lines(client):
    text_to_be_transcribed = "Something\n\nWeird"
    fake_data = {"text-to-be-transcribed": text_to_be_transcribed, "chosen-language": "en-us"}
    response = client.post("/", fake_data)

    assert response.status_code == 200
    assert len(response.context) > 0
    for item in response.context:
        assert item.template_name == "core/pages/home.html"
    assert response.context["transcription"] == [
        {"phone": "sʌmθɪŋ", "word": "Something"},
        {"phone": "wɪɹd", "word": "Weird"},
    ]
    assert response.context["text"] == "Something Weird"
    assert response.context["language"] == fake_data["chosen-language"]
    number_of_params = len(response.context[0].dicts[-1])
    assert number_of_params == 3
