from parsel import Selector


def test_should_return_home_page(client):
    response = client.get("/")

    assert response.status_code == 200
    assert len(response.context) > 0
    for item in response.context:
        assert item.template_name == "core/pages/home.html"

    selector = Selector(text=str(response.content))
    title = selector.xpath("//title/text()").get()

    assert title == "Rave of Phonetics: Your IPA transcription and spelling tool"


def test_should_return_home_page_with_phones_from_words_given_language_en_us_scenario_1(client):
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
    assert number_of_params == 4


def test_should_return_home_page_with_phones_from_words_given_language_en_us_scenario_2(client):
    fake_data = {"text-to-be-transcribed": "123 something must be avoided", "chosen-language": "en-us"}
    response = client.post("/", fake_data)

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
    assert response.context["text"] == fake_data["text-to-be-transcribed"]
    assert response.context["language"] == fake_data["chosen-language"]
    number_of_params = len(response.context[0].dicts[-1])
    assert number_of_params == 4


def test_should_return_home_page_with_phones_from_words_given_language_en_us_scenario_3(client):
    fake_data = {
        "text-to-be-transcribed": "Hello my friend, stay awhile and listen.",
        "chosen-language": "en-us",
        "with-stress": "on",
    }
    response = client.post("/", fake_data)

    assert response.status_code == 200
    assert len(response.context) > 0
    for item in response.context:
        assert item.template_name == "core/pages/home.html"
    assert response.context["transcription"] == [
        {"phone": "həlˈoʊ", "word": "Hello"},
        {"phone": "mˈaɪ", "word": "my"},
        {"phone": "fɹˈɛnd,", "word": "friend,"},
        {"phone": "stˈeɪ", "word": "stay"},
        {"phone": "ɐwˈaɪl", "word": "awhile"},
        {"phone": "ˈænd", "word": "and"},
        {"phone": "lˈɪsən.", "word": "listen."},
    ]
    assert response.context["text"] == fake_data["text-to-be-transcribed"]
    assert response.context["language"] == fake_data["chosen-language"]
    number_of_params = len(response.context[0].dicts[-1])
    assert number_of_params == 4


def test_should_return_home_page_with_phones_from_words_given_language_en_gb_scenario_1(client):
    fake_data = {"text-to-be-transcribed": "123 something must be avoided", "chosen-language": "en-gb"}
    response = client.post("/", fake_data)

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
    assert response.context["text"] == fake_data["text-to-be-transcribed"]
    assert response.context["language"] == fake_data["chosen-language"]
    number_of_params = len(response.context[0].dicts[-1])
    assert number_of_params == 4


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
    assert number_of_params == 4
