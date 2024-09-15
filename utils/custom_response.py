from flask import make_response, jsonify, Response

def response(json: dict, statusCode: int, contentType: str) -> Response:
    # To make it easier to send back responses we can use this function. 
    # By using the "make_response()" method we create an empty response.
    # Bu default if you use the "jsonfiy()" method it returns a response
    # object. But if we chain the "data" property to it we will get JUST
    # the raw JSON. And we can use the "content_type" property to set a 
    # content type for the response, for example "application/json".
    response = make_response()
    response.data = jsonify(json).data
    response.status_code = statusCode
    response.content_type = contentType
    return response