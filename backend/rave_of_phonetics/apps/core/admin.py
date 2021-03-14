from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.db.models import QuerySet

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
    actions = [
        "apply_suggestion",
    ]
    readonly_fields = ["applied"]

    def apply_suggestion(self, request, queryset: QuerySet):
        if not queryset.count() == 1:
            message = "You must select only one suggestion!"
            self.message_user(request, message, level=messages.ERROR)
        else:
            desired_suggestion: Suggestion = queryset.first()
            selected_language = Language.objects.get(language_tag=desired_suggestion.language_tag)

            defaults = {
                "word_or_symbol": desired_suggestion.word_or_symbol,
                "ipa_phonemic": desired_suggestion.ipa_phonemic,
                "ipa_phonetic": desired_suggestion.ipa_phonetic,
                "language": selected_language,
            }
            defaults = {k: v for k, v in defaults.items() if v is not None}

            with transaction.atomic():
                obj, created = Dictionary.objects.update_or_create(defaults)

                if created:
                    message = "A new dictionary entry has been created from the suggestion!"
                else:
                    message = "A dictionary has been updated successfully!"

                desired_suggestion.applied = True
                desired_suggestion.save()
                self.message_user(request, message)

    setattr(apply_suggestion, "short_description", "Apply suggestion to given word/language")
