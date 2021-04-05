from typing import Iterable

import transcriber_wrapper

from django.core.management import CommandError
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Q
from django.db.models import Subquery

from rave_of_phonetics import settings
from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from rave_of_phonetics.support.iter_utils import chunker


class Command(BaseCommand):
    help = "Fill the dictionary table giving an accent or dialect from English language. eSpeakNG is used"

    def add_arguments(self, parser):
        parser.add_argument("--use-language-tag", type=str, default="en-gb-x-rp")

    def handle(self, *args, **options):
        self.use_language_tag = options["use_language_tag"]

        if Dictionary.objects.count() == 0:
            raise CommandError("Dictionary table is empty. Fill it first")
        else:
            batch_size = getattr(settings, "DJANGO_BULK_BATCH_SIZE")
            language_model, created = Language.objects.get_or_create(language_tag=self.use_language_tag)
            self.stdout.write(f"Was {language_model.language_tag} created? {created}")
            if not created:
                self.stdout.write(f"No need to create entries for {self.use_language_tag}")
                qs_base_lang = Dictionary.objects.filter(language_id=language_model.id, version=Dictionary.Version.V_1)
                qs_en_us = Dictionary.objects.filter(language__language_tag="en-us", version=Dictionary.Version.V_1)
                subquery = Subquery(qs_base_lang.values("word_or_symbol"))
                missing_words_base_lang = qs_en_us.filter(~Q(word_or_symbol__in=subquery)).iterator()

                _create_entries(self.stdout, batch_size, missing_words_base_lang, language_model)
            else:
                self.stdout.write("Creating iterator and DTOs")
                missing_words_base_lang = Dictionary.objects.filter(version=Dictionary.Version.V_1).iterator()

                _create_entries(self.stdout, batch_size, missing_words_base_lang, language_model)


def _create_entries(stdout, batch_size: int, iterator, language_model):
    dtos_generator = _translate_to_valid_entries_to_be_saved(iterator, language_model)

    stdout.write("Initializing process...")
    saved_data = 0
    for dtos in chunker(dtos_generator, batch_size):
        with transaction.atomic():
            Dictionary.objects.bulk_create(dtos, batch_size)
        saved_data += batch_size
        if saved_data % 20_000 == 0:
            stdout.write(f"Entries saved: {Dictionary.objects.count()}")

    stdout.write(f"Total entries created: {Dictionary.objects.count()}")


def _translate_to_valid_entries_to_be_saved(iterator: Iterable[Dictionary], language: Language) -> Iterable[Dictionary]:
    transcriber = transcriber_wrapper.build_transcriber(language.language_tag)
    default_options = {"with_stress": True, "phoneme_separator": " "}

    for dict_entry in iterator:
        word_or_symbol = dict_entry.word_or_symbol
        version = Dictionary.Version.V_1

        result = transcriber.transcribe([word_or_symbol], **default_options)
        assert len(result) == 1
        ipa_phonemic = result[0]

        yield Dictionary(
            word_or_symbol=word_or_symbol,
            ipa_phonemic=ipa_phonemic,
            # TODO: Maybe syllable can be automatically generated from a logic
            ipa_phonemic_syllables=None,
            version=version,
            language=language,
        )
