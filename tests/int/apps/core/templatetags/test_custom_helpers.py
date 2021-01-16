from django.template import Context
from django.template import Template
from pytest_mock import MockFixture

from rave_of_phonetics.support.text_helpers import clear_newlines_and_spaces


def test_should_return_defined_variable_from_settings(mocker):
    site_url_value = "jafar.com"
    mocker.patch("rave_of_phonetics.settings.SITE_URL", site_url_value)
    context_configuration = Context()
    template_configuration = """
        {% load custom_helpers %}
        {% get_value_from_settings "SITE_URL" %}
    """
    template = Template(template_configuration)
    rendered_template = template.render(context_configuration)
    cleaned_rendered_template = clear_newlines_and_spaces(rendered_template)

    assert cleaned_rendered_template == site_url_value


def test_should_return_nothing_given_the_variable_is_not_available():
    context_configuration = Context()
    template_configuration = """
        {% load custom_helpers %}
        {% get_value_from_settings "THIS_DOES_NOT_EXIST" %}
    """
    template = Template(template_configuration)
    rendered_template = template.render(context_configuration)
    cleaned_rendered_template = clear_newlines_and_spaces(rendered_template)

    assert cleaned_rendered_template == ""
