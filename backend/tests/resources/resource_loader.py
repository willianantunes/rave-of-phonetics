import os


def resource_location(file_name: str):
    my_current_directory = os.path.dirname(os.path.realpath(__file__))
    where_the_file_should_be = f"{my_current_directory}/{file_name}"

    if not os.path.isabs(where_the_file_should_be):
        where_the_file_should_be = os.path.abspath(where_the_file_should_be)

    return where_the_file_should_be
