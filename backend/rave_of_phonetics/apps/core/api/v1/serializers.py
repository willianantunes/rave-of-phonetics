from rest_framework import serializers

from rave_of_phonetics.apps.core.models import Suggestion


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = ["word_or_symbol", "explanation", "ipa_phonemic", "ipa_phonetic", "language_tag"]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # I know, it's hard-coded, but better than consult the database
        # My case is quite particular...
        self.supported_languages = ["en-us", "en-gb"]

    def validate(self, data):
        error_details = {}
        language_tag = data["language_tag"]
        ipa_phonemic = data.get("ipa_phonemic")
        ipa_phonetic = data.get("ipa_phonetic")

        # TODO: Include validation regarding received IPA symbols
        if not ipa_phonemic and not ipa_phonetic:
            error_details["ipa_phonemic or ipa_phonetic"] = "At least one field should be provided"

        if language_tag not in self.supported_languages:
            error_details["language_tag"] = "Language tag not supported"

        if error_details:
            raise serializers.ValidationError(error_details)

        if language_tag == self.supported_languages[1]:
            data["language_tag"] = "en-gb-x-rp"

        return data
