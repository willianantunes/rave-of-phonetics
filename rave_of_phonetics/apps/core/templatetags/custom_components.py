from django import template

from rave_of_phonetics.support.text_helpers import clear_newlines
from rave_of_phonetics.support.text_helpers import strip_left_and_right_side

register = template.Library()


@register.tag
def entry_changelog(parser, token):
    filename = "core/components/entry_changelog.html"
    bits = token.split_contents()[1:]
    # parser.compile_filter can resolve the all the variables given a context
    args_to_be_resolved = [parser.compile_filter(bit) for bit in bits]

    def handler(title, registered_at, featured_added, features_updated):
        featured_added = int(featured_added)
        features_updated = int(features_updated)
        features = []

        if featured_added:
            features.append({"added": True, "quantity": featured_added})
        if features_updated:
            features.append({"updated": True, "quantity": features_updated})

        return {"title": title, "registered_at": registered_at, "features": features}

    nodelist = parser.parse(("endentry_changelog",))
    parser.delete_first_token()
    return ChangeLogNode(nodelist, args_to_be_resolved, handler, filename)


class ChangeLogNode(template.Node):
    def __init__(self, nodelist, args, handler, filename):
        self.nodelist = nodelist
        self.args = args
        self.handler = handler
        self.filename = filename

    def get_resolved_arguments(self, context):
        return [var.resolve(context) for var in self.args]

    def render(self, context):
        # Resolve what is needed
        resolved_args = self.get_resolved_arguments(context)
        params_to_send_to_template = self.handler(*resolved_args)
        text_written_inside_the_tag = self.nodelist.render(context)
        text_written_inside_the_tag = strip_left_and_right_side(clear_newlines(text_written_inside_the_tag))
        # Template setup and sending variables to the context
        configured_template = context.template.engine.get_template(self.filename)
        params_to_send_to_template["description"] = text_written_inside_the_tag
        new_context = context.new(params_to_send_to_template)
        # Finally rendering it
        return configured_template.render(new_context)
