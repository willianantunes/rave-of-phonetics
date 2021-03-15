from unittest.case import TestCase

import pytest

from rave_of_phonetics.apps.core.api.v2.serializers import TranscriberSerializer
from tests.support.models_utils import create_language


class TranscriberSerializerTest(TestCase):
    def test_should_be_properly_configured(self):
        serializer = TranscriberSerializer()

        assert len(serializer.fields) == 2

        text_field = serializer.fields["text"]
        language_field = serializer.fields["language"]

        assert text_field.required
        assert text_field.max_length == 2_000

        assert language_field.required
        assert language_field.max_length == 20

    def test_should_return_error_given_language_is_not_supported(self):
        fake_data = {"text": "jafar", "language": "pt-br"}
        serializer = TranscriberSerializer(data=fake_data)

        assert not serializer.is_valid()
        assert len(serializer.errors) == 1
        assert str(serializer.errors["language"][0]) == "Desired language not supported"

    def test_should_inform_that_is_valid(self):
        fake_data = {"text": "iago", "language": "en-gb"}
        serializer = TranscriberSerializer(data=fake_data)

        assert serializer.is_valid()
