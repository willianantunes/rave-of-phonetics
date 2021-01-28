from django import template

from rave_of_phonetics import settings

register = template.Library()


@register.simple_tag
def get_value_from_settings(name):
    return getattr(settings, name, "")
