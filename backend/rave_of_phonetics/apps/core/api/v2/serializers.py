from rest_framework import serializers


class TranscriberSerializer(serializers.Serializer):
    # https://www.django-rest-framework.org/api-guide/fields/#listfield
    words = serializers.ListField(child=serializers.CharField(max_length=45), allow_empty=False, max_length=200)
    language = serializers.CharField(max_length=20, required=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # I know, it's hard-coded, but better than consult the database
        # My case is quite particular...
        self.supported_languages = ["en-us", "en-gb"]

    def validate(self, data):
        error_details = {}
        language = data["language"]

        if language not in self.supported_languages:
            error_details["language"] = "Desired language not supported"

        if error_details:
            raise serializers.ValidationError(error_details)

        if language == self.supported_languages[1]:
            data["language"] = "en-gb-x-rp"

        return data
