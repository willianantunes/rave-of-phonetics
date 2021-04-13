import logging

from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.db.models import QuerySet
from django.utils.safestring import mark_safe

from rave_of_phonetics.apps.core.business.word_researcher import most_sought_words
from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from rave_of_phonetics.apps.core.models import ResearchedWord
from rave_of_phonetics.apps.core.models import Suggestion
from rave_of_phonetics.support.django_helpers import AlphabetFilter
from rave_of_phonetics.support.django_helpers import CustomModelAdminMixin
from rave_of_phonetics.support.django_helpers import TimeLimitedPaginator
from rave_of_phonetics.support.django_typing import QueryType

logger = logging.getLogger(__name__)


@admin.register(Language)
class LanguageAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    pass


@admin.register(Dictionary)
class DictionaryAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    # TODO: Use something like this instead: (word_or_symbol", AlphabetFilter)
    custom_alphabet_filter_field = "word_or_symbol"
    search_fields = ["word_or_symbol"]
    list_filter = [
        "version",
        "classification",
        "language__language_tag",
        AlphabetFilter,
    ]
    paginator = TimeLimitedPaginator


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
                obj, created = Dictionary.objects.update_or_create(**defaults)

                if created:
                    message = "A new dictionary entry has been created from the suggestion!"
                else:
                    message = "A dictionary has been updated successfully!"

                desired_suggestion.applied = True
                desired_suggestion.save()
                self.message_user(request, message)

    setattr(apply_suggestion, "short_description", "Apply suggestion to given word/language")


@admin.register(ResearchedWord)
class ResearchedWordAdmin(CustomModelAdminMixin, admin.ModelAdmin):
    custom_alphabet_filter_field = "word_or_symbol"
    search_fields = ["ip_address"]
    list_filter = [
        "created_at",
        "language_tag",
        AlphabetFilter,
    ]
    actions = [
        "identify_five_most_sought_words",
    ]
    paginator = TimeLimitedPaginator

    def identify_five_most_sought_words(self, request, queryset: QueryType[ResearchedWord]):
        logger.debug("Evaluating most sought words")
        words_qs = most_sought_words(queryset)

        logger.debug("Creating message")
        counter, limit = 1, 5
        message_about_sought_words = []
        for word_details in words_qs:
            word = word_details["word_or_symbol"]
            times = word_details["times"]
            phrase = f"&emsp;• <strong>{word.upper()}</strong>: {times} times"
            message_about_sought_words.append(phrase)
            if counter < limit:
                counter += 1
            else:
                break
        logger.debug("Delivering to user")
        message_about_sought_words = "<br />\n".join(message_about_sought_words)
        # Mark safe is needed in order to break lines
        final_message = mark_safe(f"The five most sought words are 🤔: <br />\n{message_about_sought_words}")
        self.message_user(request, final_message, level=messages.INFO)

    setattr(identify_five_most_sought_words, "short_description", "Know the five most sought words")
