from rest_framework import serializers

from rave_of_phonetics.apps.core.models import Language
from rave_of_phonetics.apps.core.models import Suggestion


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = ["word_or_symbol", "explanation", "ipa_phonemic", "ipa_phonetic", "language_tag"]

    def validate(self, data):
        error_details = {}
        language_tag = data["language_tag"]
        ipa_phonemic = data.get("ipa_phonemic")
        ipa_phonetic = data.get("ipa_phonetic")

        # TODO: Include validation regarding received IPA symbols
        if not ipa_phonemic and not ipa_phonetic:
            error_details["ipa_phonemic or ipa_phonetic"] = "At least one field should be provided"

        if not Language.objects.filter(language_tag=language_tag).exists():
            error_details["language_tag"] = "Language tag not supported"

        if error_details:
            raise serializers.ValidationError(error_details)

        return data
