import os
import string

from distutils.util import strtobool

from django.contrib import admin
from django.core.paginator import Paginator
from django.db import OperationalError
from django.db import connection
from django.db import transaction
from django.db.models import ForeignKey
from django.http.response import HttpResponseRedirectBase
from django.utils.functional import cached_property


class CustomModelAdminMixin:
    def __init__(self, model, admin_site):
        if self.list_display and self.list_display[0] == "__str__":
            self.list_display = [field.name for field in model._meta.fields if field.name != "id"]
        if not self.list_filter:
            self.list_filter = ["created_at", "updated_at"]
        if not self.readonly_fields:
            self.readonly_fields = ["created_at", "updated_at"]
        if not self.raw_id_fields:
            # Only for FOREIGN KEY fields
            raw_id_fields = []
            for key, value in model._meta._forward_fields_map.items():
                if type(value) is ForeignKey and not key.endswith("id"):
                    raw_id_fields.append(key)
            if raw_id_fields:
                self.raw_id_fields = raw_id_fields
        super(CustomModelAdminMixin, self).__init__(model, admin_site)


class AlphabetFilter(admin.SimpleListFilter):
    title = "alphabet"
    parameter_name = "letter"

    def lookups(self, request, model_admin):
        self.field_path = f"{model_admin.custom_alphabet_filter_field}__startswith"
        abc = list(string.ascii_lowercase)
        return ((c.lower(), c.upper()) for c in abc)

    def queryset(self, request, queryset):
        chosen_letter = self.value()
        if chosen_letter:
            filtering = {self.field_path: chosen_letter}
            return queryset.filter(**filtering)


class TimeLimitedPaginator(Paginator):
    """
    Paginator that enforced a timeout on the count operation.
    When the timeout is reached a "fake" large value is returned instead,
    Why does this hack exist? On every admin list view, Django issues a
    COUNT on the full queryset. There is no simple workaround. On big tables,
    this COUNT is extremely slow and makes things unbearable.
    See more details here: https://hakibenita.com/optimizing-the-django-admin-paginator
    """

    @cached_property
    def count(self):
        # We set the timeout in a db transaction to prevent it from
        # affecting other transactions.
        with transaction.atomic(), connection.cursor() as cursor:
            cursor.execute("SET LOCAL statement_timeout TO 200;")
            try:
                return super().count
            except OperationalError:
                return 9999999999


def eval_env_as_boolean(varname, standard_value) -> bool:
    return bool(strtobool(os.getenv(varname, str(standard_value))))


def getenv_or_raise_exception(varname: str) -> str:
    """
    Retrieve a environment variable that MUST be set or raise an appropriate exception.
    """
    env = os.getenv(varname)

    if env is None:
        raise EnvironmentError(f"Environment variable {varname} is not set!")

    return env


class HttpResponseTemporaryRedirect(HttpResponseRedirectBase):
    status_code = 307
