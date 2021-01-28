from django.template import Context
from django.template import Template

from tests.support.utils import prettify_html


def test_should_render_custom_component_with_added_and_updated():
    context_configuration = Context()
    template_configuration = """
        {% load custom_components %}
        {% with title="History item now can be consulted" registered_at="January 10th, 2021" %}
            {% entry_changelog title registered_at 1 1 %}
                Jafar and Iago
            {% endentry_changelog %}
        {% endwith %}
    """
    template = Template(template_configuration)
    rendered_template = template.render(context_configuration)
    prettified_rendered_template = prettify_html(rendered_template)

    assert (
        prettified_rendered_template
        == """<article class="changelog-article">
  <div class="col s12">
    <header>
      <h3 class="center-align">
        History item now can be consulted
      </h3>
    </header>
  </div>
  <div class="col s12 m4 l3">
    <aside>
      <p>
        January 10th, 2021
      </p>
      <span class="new badge blue" data-badge-caption="added">
        1
      </span>
      <span class="new badge orange" data-badge-caption="updated">
        1
      </span>
    </aside>
  </div>
  <div class="col s12 m8 l9">
    <p>
      Jafar and Iago
    </p>
  </div>
</article>"""
    )
