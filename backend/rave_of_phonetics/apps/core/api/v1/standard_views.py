from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response

from rave_of_phonetics.apps.core.api.permissions import IsValidRecaptcha
from rave_of_phonetics.apps.core.api.v1.serializers import SuggestionSerializer


class SuggestionViewSet(viewsets.ViewSet):
    permission_classes = [IsValidRecaptcha]
    http_method_names = ["post", "options"]
    serializer_class = SuggestionSerializer

    def create(self, request, *args, **kwargs) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
