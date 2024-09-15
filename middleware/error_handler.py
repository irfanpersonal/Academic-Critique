from flask import jsonify
from utils.custom_error import CustomError
from utils.http_status_codes import StatusCodes # If an error is of type CustomError then access the message (args[0]) and statusCode
from sqlalchemy.exc import IntegrityError, DataError # If an error of type IntegrityError has occurred that means, the input was invalid, didn't meet the criteria (validation)
from werkzeug.exceptions import RequestEntityTooLarge

def errorHandler(error):
    # print('error', error) # During Development not Production
    # If the Error is an instance of the CustomError class we made than access the 
    # message (args) and statusCode properties.
    if isinstance(error, CustomError):
        return jsonify({"msg": error.args[0]}), error.statusCode
    elif isinstance(error, DataError) or isinstance(error, ValueError) or isinstance(error, IntegrityError):
        return jsonify({"msg": "Please check all inputs!"}), StatusCodes.BAD_REQUEST
    elif isinstance(error, RequestEntityTooLarge):
        # The reason why handling or even making this an error is because if you enter in a file that is too large it
        # ends the request. So the logic won't go through.
        return jsonify({"msg": "All File Uploads have a limit of 2MB!"}), StatusCodes.BAD_REQUEST
    else:
        # For development/testing purposes
        # return jsonify({"msg": f"{error}"}), StatusCodes.INTERNAL_SERVER_ERROR
        # For production/finished purposes
        return jsonify({"msg": "Something went wrong, try again later!"}), StatusCodes.INTERNAL_SERVER_ERROR