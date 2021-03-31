from typing import Generator

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Count

from rave_of_phonetics import settings
from rave_of_phonetics.apps.core.business.CMUDatabaseHandler import CMUDatabaseHandler
from rave_of_phonetics.apps.core.business.CMUDatabaseHandler import CMULine
from rave_of_phonetics.apps.core.business.CMUDatabaseHandler import Variant
from rave_of_phonetics.apps.core.business.InternationalPhoneticAlphabet import InternationalPhoneticAlphabet
from rave_of_phonetics.apps.core.models import Dictionary
from rave_of_phonetics.apps.core.models import Language
from rave_of_phonetics.support.iter_utils import chunker


class Command(BaseCommand):
    help = "Seed the database with CMU pronunciation dictionary"

    def add_arguments(self, parser):
        parser.add_argument("--cmu-file-location", type=str, help="Full path where CMU database file is")
        parser.add_argument("--use-language-tag", type=str, default="en-us")
        parser.add_argument("--create-super-user", action="store_true")
        parser.add_argument("-u", type=str, default="admin")
        parser.add_argument("-p", type=str, default="admin")

    def handle(self, *args, **options):
        self.cmu_file_location = options["cmu_file_location"]
        self.use_language_tag = options["use_language_tag"]
        self.create_super_user = options["create_super_user"]
        self.admin_username = options["u"].strip()
        self.admin_password = options["p"].strip()

        if self.create_super_user:
            if User.objects.filter(username=self.admin_username).count() == 0:
                self.stdout.write(f"Creating ADMIN username {self.admin_username}")
                _create_super_user(self.admin_username, self.admin_password)
            else:
                self.stdout.write(f"Super user already exists")

        if self.cmu_file_location:
            carnegie_mellon_university_database = CMUDatabaseHandler(self.cmu_file_location)
            number_of_entries = carnegie_mellon_university_database.number_of_valid_entries
            self.stdout.write(f"Number of entries: {number_of_entries}")

            if number_of_entries <= Dictionary.objects.count():
                self.stdout.write("No need to fill the table!")
            else:
                batch_size = getattr(settings, "DJANGO_BULK_BATCH_SIZE")
                language_model, created = Language.objects.get_or_create(language_tag=self.use_language_tag)
                self.stdout.write(f"Was {language_model.language_tag} created? {created}")

                self.stdout.write("Initializing database handler and generators...")
                cmu_line_generator = carnegie_mellon_university_database.retrieve_cmu_lines()
                dtos_generator = _translation_to_dtos(cmu_line_generator, language_model)

                self.stdout.write("All done! Let's go...")
                saved_data = 0
                for dtos in chunker(dtos_generator, batch_size):
                    with transaction.atomic():
                        Dictionary.objects.bulk_create(dtos, batch_size)
                    saved_data += batch_size
                    if saved_data % 20_000 == 0:
                        self.stdout.write(f"Entries saved: {Dictionary.objects.count()}")
                self.stdout.write(f"Total entries created: {Dictionary.objects.count()}")

                self.stdout.write("Excluding duplicated entries")
                base_query_set = Dictionary.objects.values("word_or_symbol", "ipa_phonemic")
                duplicated_entries_qs = base_query_set.annotate(count_result=Count("pk")).filter(count_result__gt=1)
                with transaction.atomic():
                    for duplicated_entry in duplicated_entries_qs:
                        del duplicated_entry["count_result"]
                        self.stdout.write(f"Deleting duplicated entry for the following: {duplicated_entry}")
                        to_be_deleted = Dictionary.objects.filter(**duplicated_entry).order_by("-version").first()
                        to_be_deleted.delete()


def _translation_to_dtos(
    cmu_line_generator: Generator[CMULine, None, None], language: Language
) -> Generator[Dictionary, None, None]:
    for cmu_line in cmu_line_generator:
        result = InternationalPhoneticAlphabet.ipa_format_from_arpabet(cmu_line.phonemes)

        if cmu_line.variant == Variant.V1:
            version = Dictionary.Version.V_1
        elif cmu_line.variant == Variant.V2:
            version = Dictionary.Version.V_2
        elif cmu_line.variant == Variant.V3:
            version = Dictionary.Version.V_3
        else:
            version = Dictionary.Version.V_4

        syllable_separator_mark = Dictionary.syllable_separator_mark
        arpabet_phoneme_separator_mark = Dictionary.arpabet_phoneme_separator_mark
        ipa_phonemic_separator_mark = Dictionary.ipa_phonemic_separator_mark

        # Better to join without spaces
        ipa_phonemic = ipa_phonemic_separator_mark.join(result.ipa_format)
        ipa_phonemic_syllables = Dictionary.create_syllable_entry_ipa(result.ipa_syllable)
        # Better to leave with spaces
        arpabet_phoneme = arpabet_phoneme_separator_mark.join(result.arpabet_format)
        arpabet_phoneme_syllables = Dictionary.create_syllable_entry_arpabet(result.arpabet_syllable)

        yield Dictionary(
            word_or_symbol=cmu_line.word_or_symbol,
            arpabet_phoneme=arpabet_phoneme,
            arpabet_phoneme_syllables=arpabet_phoneme_syllables,
            ipa_phonemic=ipa_phonemic,
            ipa_phonemic_syllables=ipa_phonemic_syllables,
            version=version,
            language=language,
        )


def _create_super_user(username, password):
    return User.objects.create_superuser(username, None, password)
