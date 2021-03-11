import os

import pytest


@pytest.hookimpl(tryfirst=True)
def pytest_load_initial_conftests(args, early_config, parser):
    # This is needed because pytest django creates a database, so schema should not be used
    # See settings.py to understand more
    os.environ["PYTEST_RUNNING"] = "True"
