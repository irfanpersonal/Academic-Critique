from flask import request, jsonify, make_response
from utils.custom_error import CustomError
from utils.http_status_codes import StatusCodes
from utils.getDatabaseInformation import getDatabaseInformation
from utils.enums import Role
from utils.token import createToken, createCookieWithToken

def register():
    db, Models = getDatabaseInformation()
    isFirstAccount = True if len(db.session.query(Models.User).all()) == 0 else False
    usernameAlreadyExists = db.session.query(Models.User).filter(Models.User.username == request.form.get('username')).one_or_none()
    emailAlreadyExists = db.session.query(Models.User).filter(Models.User.email == request.form.get('email')).one_or_none()
    if usernameAlreadyExists and emailAlreadyExists:
        raise CustomError({"text": "Please check all inputs!", "duplicate": ['username', 'email']}, StatusCodes.BAD_REQUEST)
    elif usernameAlreadyExists:
        raise CustomError({"text": "Please check all inputs!", "duplicate": ['username']}, StatusCodes.BAD_REQUEST)
    elif emailAlreadyExists:
        raise CustomError({"text": "Please check all inputs!", "duplicate": ['email']}, StatusCodes.BAD_REQUEST)
    user = Models.User(
        username = request.form.get('username') or '',
        email = request.form.get('email') or '',
        password = request.form.get('password') or '',
        country = request.form.get('country') or '',
        role = Role.OWNER if isFirstAccount else Role.USER
    )
    db.session.add(user)
    db.session.commit()
    token = createToken(user)
    # The jsonfify method from "flask" returns a json object. But if you want to be 
    # explicit we can use the "make_response()" method. And define all our options at once. 
    response = make_response()
    # To set the status code of your response use the "status_code" property on the response
    # object. 
    response.status_code = StatusCodes.CREATED
    createCookieWithToken(token, response)
    # To return JSON in our response we need to set the response.data property to the return 
    # of a "jsonify()" method along with the "data" property chained to the end of it. This is 
    # because the "jsonify()" method on its own returns a "response" object. But if we chain
    # the "data" property to it we will get the raw json.
    response.data = jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "country": user.country.name,
            # Use name property on enum to get the key
            "role": user.role.name
        }
    }).data
    # Make sure to set the "content_type" property to the string "application/json" otherwise
    # it won't be JSON. Just regular text/html. So to make that distinction add this very 
    # important "content_type" in.
    response.content_type = 'application/json'
    return response

def login():
    db, Models = getDatabaseInformation()
    email, password = request.form.get('email'), request.form.get('password')
    if not email and not password:
        raise CustomError({"text": 'Please provide value for email and password', "notProvided": ['email', 'password']}, StatusCodes.BAD_REQUEST)
    if not email:
        raise CustomError({"text": 'Please provide value for email', "notProvided": ['email']}, StatusCodes.BAD_REQUEST)
    elif not password:
        raise CustomError({"text": 'Please provide value for password', "notProvided": ['password']}, StatusCodes.BAD_REQUEST)
    user = db.session.query(Models.User).filter(Models.User.email == email).one_or_none()
    if not user:
        raise CustomError({"text": 'No User Found with the Email Provided!', "incorrect": ['email']}, StatusCodes.NOT_FOUND)
    isCorrect = user.comparePassword(password)
    if not isCorrect:
        raise CustomError({"text": 'Incorrect Password!', "incorrect": ['password']}, StatusCodes.BAD_REQUEST)
    token = createToken(user)
    response = make_response()
    response.status_code = StatusCodes.OK
    createCookieWithToken(token, response)
    response.data = jsonify({"user": {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "country": user.country.name,
        "role": user.role.name
    }}).data
    response.content_type = 'application/json'
    return response

def logout():
    response = make_response()
    # To remove/delete a cookie use the "delete_cookie()" method on the "make_response()" object. It
    # takes in a string which is equal to the cookie key.
    response.delete_cookie('token')
    response.status_code = StatusCodes.OK
    response.data = jsonify({"msg": "Successfully Logged Out!"}).data
    response.content_type = 'application/json'
    return response