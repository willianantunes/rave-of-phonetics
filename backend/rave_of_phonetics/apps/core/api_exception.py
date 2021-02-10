from rest_framework.exceptions import APIException


class EmptyBodyException(APIException):
    status_code = 400
    default_detail = "You should send a body with a valid JSON"


class InvalidBodyException(APIException):
    status_code = 400
    default_detail = "Do you know the contract? 🤔"
