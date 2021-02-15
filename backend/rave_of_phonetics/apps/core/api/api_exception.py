from rest_framework.exceptions import APIException


class EmptyBodyException(APIException):
    status_code = 400
    default_detail = "You should send at least a body 😅, shouldn't you?"


class InvalidContractException(APIException):
    status_code = 400
    default_detail = "Do you know the contract? 🤔"


class UnauthorizedException(APIException):
    status_code = 401
    default_detail = "You are not authorized 😬"
