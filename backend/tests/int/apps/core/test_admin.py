import pytest

from django.contrib.admin import helpers
from django.contrib.admin import site
from django.contrib.auth.models import User
from django.contrib.messages import get_messages
from django.db.models import QuerySet
from django.urls import reverse
from pytz import unicode

from rave_of_phonetics.apps.core.admin import AlphabetFilter
from rave_of_phonetics.apps.core.admin import DictionaryAdmin
from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import ResearchedWord
from rave_of_phonetics.apps.core.models import Suggestion
from tests.support.models_utils import create_language
from tests.support.models_utils import create_researched_word_entries
from tests.support.models_utils import create_suggestion
from tests.support.text_utils import alphabet_range_as_unicode


@pytest.mark.skip("It temporary disabled")
def test_should_create_dictionary_entry_from_suggestion(admin_client):
    # Arrange
    word_or_symbol, ipa_phonemic = "theoretically", "ˌθiəˈrɛtɪkəli"
    explanation = "I think this phonemic is better when I compare with what I am receiving from RoP"
    created_language = create_language("en-us")
    created_suggestion = create_suggestion(word_or_symbol, ipa_phonemic, explanation=explanation)
    assert Dictionary.objects.count() == 0
    # Act
    fake_configured_action = {
        "action": "apply_suggestion",
        helpers.ACTION_CHECKBOX_NAME: [unicode(created_suggestion.pk)],
    }
    address = f"{reverse('admin:index')}core/suggestion/"
    response = admin_client.post(address, data=fake_configured_action)
    # Assert
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


def test_should_inform_most_sought_words(admin_client):
    # Arrange
    words = [
        "c'mon",
        "dude",
        "c'mon",
        "dude",
        "select",
        "researched",
        "word",
        "that",
        "to",
        "change",
        "django",
        "administration",
        "select",
        "welcome",
        "throught",
        "authentication",
        "and",
        "authorization",
        "throught",
        "authentication",
        "and",
        "throught",
        "authorization",
        "this",
        "throught",
    ]
    create_researched_word_entries(words)
    # Act
    fake_configured_action = {
        "action": "identify_five_most_sought_words",
        helpers.ACTION_CHECKBOX_NAME: [unicode(rw.pk) for rw in ResearchedWord.objects.all()],
    }
    address = f"{reverse('admin:index')}core/researchedword/"
    response = admin_client.post(address, data=fake_configured_action)
    # Assert
    assert response.status_code == 302
    assert response.url == address
    messages = list(get_messages(response.wsgi_request))
    assert len(messages) == 1
    message_details = messages[0]
    assert message_details.level_tag == "info"
    expected_message = """
        The five most sought words are 🤔: <br />
        &emsp;• <strong>THROUGHT</strong>: 4 times<br />
        &emsp;• <strong>AND</strong>: 2 times<br />
        &emsp;• <strong>DUDE</strong>: 2 times<br />
        &emsp;• <strong>AUTHENTICATION</strong>: 2 times<br />
        &emsp;• <strong>SELECT</strong>: 2 times
    """
    expected_message = expected_message.strip().replace("        ", "")
    assert message_details.message == expected_message


@pytest.mark.django_db
def test_should_dictionary_admin_has_custom_filter_alphabetically(rf):
    # Arrange
    # https://github.com/django/django/blob/9ee693bd6cf4074f04ec51c6f3cfe87cad392f12/tests/admin_filters/tests.py#L820
    expected_field = "word_or_symbol"
    expected_parameter_name = "letter"
    expected_parameter_value = "a"
    jafar = User.objects.create_superuser("jafar", "jafar@agrabah.com", "iago@123")
    request = rf.get("/", {expected_parameter_name: expected_parameter_value})
    request.user = jafar
    dictionary_admin = DictionaryAdmin(Dictionary, site)
    # Act
    changelist = dictionary_admin.get_changelist_instance(request)
    # Assert
    generated_query_set: QuerySet = changelist.get_queryset(request)
    expected_where_clause = f""""core_dictionary"."{expected_field}"::text LIKE {expected_parameter_value}%"""
    assert expected_where_clause in str(generated_query_set.query)
    all_available_filters = changelist.get_filters(request)[0]
    alphabet_filter = all_available_filters[3]
    alphabet_filter: AlphabetFilter
    assert alphabet_filter.field_path == f"{expected_field}__startswith"
    assert alphabet_filter.title == "alphabet"
    assert alphabet_filter.parameter_name == expected_parameter_name
    alphabet_range = alphabet_range_as_unicode()
    create_tuple_of_letters = lambda letter: (chr(letter).lower(), chr(letter).upper())
    expected_lookup_choices = list(map(create_tuple_of_letters, alphabet_range))
    assert len(alphabet_filter.lookup_choices) == 26
    assert alphabet_filter.lookup_choices == expected_lookup_choices
