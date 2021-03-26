from unittest import TestCase

from rave_of_phonetics.apps.core.api.v2.serializers import TranscriberSerializer


class TranscriberSerializerTest(TestCase):
    def test_should_be_properly_configured(self):
        serializer = TranscriberSerializer()

        assert len(serializer.fields) == 2

        list_field = serializer.fields["words"]
        language_field = serializer.fields["language"]

        assert not list_field.allow_empty
        assert list_field.max_length == 200
        char_field = list_field.child
        assert char_field.max_length == 45

        assert language_field.required
        assert language_field.max_length == 20

    def test_should_return_error_given_language_is_not_supported(self):
        fake_data = {"words": ["jafar"], "language": "pt-br"}
        serializer = TranscriberSerializer(data=fake_data)

        assert not serializer.is_valid()
        assert len(serializer.errors) == 1
        assert str(serializer.errors["language"][0]) == "Desired language not supported"

    def test_should_inform_that_is_valid(self):
        fake_data = {"words": ["iago"], "language": "en-gb"}
        serializer = TranscriberSerializer(data=fake_data)

        assert serializer.is_valid()

        words, language = serializer.validated_data["words"], serializer.validated_data["language"]
        assert words == fake_data["words"]
        assert language == fake_data["language"]
