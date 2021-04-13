# Generated by Django 3.2 on 2021-04-13 21:13

import django.db.models.expressions

from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_researchedword"),
    ]

    operations = [
        migrations.AddConstraint(
            model_name="researchedword",
            constraint=models.UniqueConstraint(
                condition=models.Q(
                    ("created_at__day", django.db.models.expressions.F("created_at__day")),
                    ("created_at__month", django.db.models.expressions.F("created_at__month")),
                    ("created_at__year", django.db.models.expressions.F("created_at__year")),
                ),
                fields=("word_or_symbol", "language_tag", "ip_address"),
                name="unique_word_entry_per_day",
            ),
        ),
    ]
