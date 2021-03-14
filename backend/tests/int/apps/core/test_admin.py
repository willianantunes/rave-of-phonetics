from django.contrib.admin import helpers
from django.contrib.messages import get_messages
from pytz import unicode

from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Suggestion
from tests.support.models_utils import create_language
from tests.support.models_utils import create_suggestion


def test_should_create_dictionary_entry_from_suggestion(admin_client):
    word_or_symbol, ipa_phonemic = "theoretically", "ˌθiəˈrɛtɪkəli"
    explanation = "I think this phonemic is better when I compare with what I am receiving from RoP"
    created_language = create_language("en-us")
    created_suggestion = create_suggestion(word_or_symbol, ipa_phonemic, explanation=explanation)
    assert Dictionary.objects.count() == 0

    fake_configured_action = {
        "action": "apply_suggestion",
        helpers.ACTION_CHECKBOX_NAME: [unicode(created_suggestion.pk)],
    }

    address = "/admin/core/suggestion/"
    response = admin_client.post(address, data=fake_configured_action)
    assert response.status_code == 302
    assert response.url == address
    messages = list(get_messages(response.wsgi_request))
    assert len(messages) == 1
    message_details = messages[0]
    assert message_details.level_tag == "info"
    assert message_details.message == "A new dictionary entry has been created from the suggestion!"
    assert Dictionary.objects.count() == 1
    persisted_dictionary: Dictionary = Dictionary.objects.first()
    assert persisted_dictionary.word_or_symbol == word_or_symbol
    assert persisted_dictionary.ipa_phonemic == ipa_phonemic
    assert persisted_dictionary.ipa_phonetic is None
    assert persisted_dictionary.language == created_language
    assert persisted_dictionary.classification == Dictionary.WordClassification.UNDEFINED
    assert persisted_dictionary.version == Dictionary.Version.V_1
    assert Suggestion.objects.count() == 1
    assert Suggestion.objects.filter(applied=True).count() == 1
