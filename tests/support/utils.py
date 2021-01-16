from yattag import indent


def prettify_html(raw):
    return indent(raw, indent_text=True)
