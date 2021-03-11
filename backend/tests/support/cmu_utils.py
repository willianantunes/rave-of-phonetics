import tempfile

from pathlib import Path

from django.core.management import call_command

from rave_of_phonetics.support.text_utils import strip_left_and_right_sides


def create_database_from_fake_cmu_content(content: str, language="en-us"):
    lines = content.split("\n")

    cleaned_lines = [strip_left_and_right_sides(line) for line in lines]
    cleaned_lines = [line for line in cleaned_lines if line]

    with tempfile.NamedTemporaryFile("w+", encoding="UTF-8", delete=False) as data:
        try:
            cmu_file = Path(data.name)
            # Saving everything
            for line in cleaned_lines:
                data.write(f"{line}\n")
            data.close()
            call_command("seed", "--cmu-file-location", cmu_file.absolute(), "--use-language-tag", language)
        finally:
            cmu_file.unlink()
