from rest_framework import serializers

from rave_of_phonetics.apps.core.models import Language


class TranscriberSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=2000, required=True)
    language = serializers.CharField(max_length=20, required=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # TODO: Avoid this as every request will hit the database at least once
        self.supported_languages = Language.objects.values_list("language_tag", flat=True)

    def validate(self, data):
        error_details = {}
        language = data["language"]

        if language not in self.supported_languages:
            error_details["language"] = "Desired language not supported"

        if error_details:
            raise serializers.ValidationError(error_details)

        return data
