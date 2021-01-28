from django.contrib.staticfiles.apps import StaticFilesConfig


class CustomStaticFilesConfig(StaticFilesConfig):
    ignore_patterns = ["css", "js", "*.map", "*.ts", "*.scss"]
