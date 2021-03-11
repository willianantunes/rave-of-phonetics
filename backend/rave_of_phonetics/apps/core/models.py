from typing import List

from django.db import models


class StandardModelMixin(models.Model):
    id = models.AutoField(primary_key=True, editable=False, verbose_name="Id")
    created_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name="Created at")
    updated_at = models.DateTimeField(auto_now=True, editable=False, verbose_name="Updated at")

    class Meta:
        abstract = True


class Language(StandardModelMixin):
    # https://github.com/espeak-ng/espeak-ng/blob/master/docs/languages.md
    # One example that might be applicable: en-gb-scotland
    language_tag = models.CharField(max_length=20, null=False, blank=False, unique=True)
    # Language: English
    # Accent/Dialect: Scottish
    # Language Family: West Germanic
    language = models.CharField(max_length=50, null=True, blank=True, verbose_name="Language")
    accent_or_dialect = models.CharField(max_length=50, null=True, blank=True, verbose_name="Accent/Dialect")
    family = models.CharField(max_length=50, null=True, blank=True, verbose_name="Family")

    def __str__(self):
        return self.language_tag


class Dictionary(StandardModelMixin):
    syllable_separator_mark = " • "
    arpabet_phoneme_separator_mark = " "
    ipa_phonemic_separator_mark = " "

    class Version(models.TextChoices):
        V_1 = "V_1", "Version 1"
        V_2 = "V_2", "Version 2"
        V_3 = "V_3", "Version 3"
        V_4 = "V_4", "Version 4"

    class WordClassification(models.TextChoices):
        NOUN = "NOUN", "Noun"
        PRONOUN = "PRONOUN", "Pronoun"
        ADJECTIVE = "ADJECTIVE", "Adjective"
        VERB = "VERB", "Verb"
        ADVERB = "ADVERB", "Adverb"
        PREPOSITION = "PREPOSITION", "Preposition"
        CONJUNCTION = "CONJUNCTION", "Conjunction"
        INTERJECTION = "INTERJECTION", "Interjection"
        SYMBOL = "SYMBOL", "Symbol"
        UNDEFINED = "UNDEFINED", "Undefined"

    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name="dictionary_entries")
    classification = models.CharField(
        max_length=15,
        null=False,
        blank=False,
        choices=WordClassification.choices,
        default=WordClassification.UNDEFINED,
    )
    version = models.CharField(
        max_length=3,
        null=False,
        blank=False,
        choices=Version.choices,
        default=Version.V_1,
    )
    # https://en.wikipedia.org/wiki/Longest_word_in_English
    # Sample word: Pneumonoultramicroscopicsilicovolcanoconiosis
    word_or_symbol = models.CharField(max_length=45, null=False, blank=False)
    description = models.CharField(max_length=100, null=True, blank=True)
    # See more in docs/NLPA-Phon1.pdf
    arpabet_phoneme = models.CharField(max_length=128, null=True, blank=True, verbose_name="ARPABET phoneme")
    arpabet_phoneme_syllables = models.CharField(max_length=128, null=True, blank=True)
    # Phonemic is the hypothetical sounds
    ipa_phonemic = models.CharField(max_length=128, null=True, blank=True, verbose_name="Phonemic transcription")
    ipa_phonemic_syllables = models.CharField(max_length=128, null=True, blank=True)
    # Phonetic is the actual production of hypothetical sounds
    ipa_phonetic = models.CharField(max_length=128, null=True, blank=True, verbose_name="Phonetic transcription")
    ipa_phonetic_syllables = models.CharField(max_length=128, null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["language", "classification", "version", "word_or_symbol"], name="unique_linguistic_set"
            )
        ]

    def __str__(self):
        return self.word_or_symbol

    @classmethod
    def create_syllable_entry_ipa(cls, syllables: List[List[str]]) -> str:
        return cls._create_syllable_entry(syllables, cls.ipa_phonemic_separator_mark)

    def transform_ipa_syllable_entry_to_object(self) -> List[List[str]]:
        syllables = self.ipa_phonemic_syllables.split(self.syllable_separator_mark)
        updated_syllables = []

        for entry in syllables:
            updated_entry = entry.split(self.ipa_phonemic_separator_mark)
            updated_syllables.append(updated_entry)

        return updated_syllables

    @classmethod
    def create_syllable_entry_arpabet(cls, syllables: List[List[str]]) -> str:
        return cls._create_syllable_entry(syllables, cls.arpabet_phoneme_separator_mark)

    @classmethod
    def _create_syllable_entry(cls, syllables: List[List[str]], separator: str) -> str:
        joined_syllables = []

        for syllable in syllables:
            joined_syllables.append(separator.join(syllable))

        return cls.syllable_separator_mark.join(joined_syllables)
