from django.contrib import admin

from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from rave_of_phonetics.apps.core.models import Suggestion
from rave_of_phonetics.support.django_helpers import CustomModelAdminMixin


@admin.register(Language)
class LanguageAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    pass


@admin.register(Dictionary)
class DictionaryAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    search_fields = ["word_or_symbol"]
    list_filter = [
        "version",
        "classification",
        "language__language_tag",
    ]


@admin.register(Suggestion)
class SuggestionAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    search_fields = ["word_or_symbol"]
    list_filter = [
        "language_tag",
        "applied",
    ]
