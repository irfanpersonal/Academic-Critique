from flask import request, jsonify, g
from utils.custom_error import CustomError
from utils.http_status_codes import StatusCodes
from utils.enums import RouteStatus
import jwt
import os
import re

def authentication():
    try:    
        # Creating blueprints to differentiate protected/not protected routes is clunky. Using a
        # global middleware function will make this a lot easier.
        protectedRoutes = [
            {
                "route": '/api/v1/user/showCurrentUser',
                "http_request_method": 'GET'
            },
            {
                "route": '/api/v1/user/updateProfile',
                "http_request_method": 'PATCH'
            },
            {
                "route": '/api/v1/user/updatePassword',
                "http_request_method": 'PATCH'
            },
            {
                "route": '/api/v1/user/generate_admin',
                "http_request_method": 'POST'
            },
            {
                "route": '/api/v1/user/overviewData',
                "http_request_method": 'GET'
            },
            {
                "route": '/api/v1/institution',
                "http_request_method": 'POST'
            },
            {
                # Using Regular Expressions we can handle routes with dynamic route parameters
                "route": '^/api/v1/institution/[a-zA-Z0-9-]+$',
                "http_request_method": 'PATCH'
            },
            {
                "route": '^/api/v1/institution/[a-zA-Z0-9-]+/image$',
                "http_request_method": 'PATCH'
            },
            {
                "route": '^/api/v1/institution/[a-zA-Z0-9-]+$',
                "http_request_method": 'DELETE'
            },
            {
                "route": '/api/v1/educator',
                "http_request_method": 'POST'
            },
            {
                "route": '^/api/v1/educator/[a-zA-Z0-9-]+$',
                "http_request_method": 'PATCH'
            },
            {
                "route": '^/api/v1/educator/[a-zA-Z0-9-]+/image$',
                "http_request_method": 'PATCH'
            },
            {
                "route": '^/api/v1/educator/[a-zA-Z0-9-]+$',
                "http_request_method": 'DELETE'
            },
            {
                "route": '/api/v1/course',
                "http_request_method": 'POST'
            },
            {
                "route": '^/api/v1/course/[a-zA-Z0-9-]+$',
                "http_request_method": 'PATCH'
            },
            {
                "route": '^/api/v1/course/[a-zA-Z0-9-]+/syllabus$',
                "http_request_method": 'PATCH'
            },
            {
                "route": '^/api/v1/course/[a-zA-Z0-9-]+$',
                "http_request_method": 'DELETE'
            },
            {
                "route": '/api/v1/review',
                "http_request_method": 'POST'
            },
            {
                "route": '^/api/v1/review/[a-zA-Z0-9-]+$',
                "http_request_method": 'PATCH'
            },
            {
                "route": '^/api/v1/review/[a-zA-Z0-9-]+$',
                "http_request_method": 'DELETE'
            }
        ]
        # If the request path is equal to a route within the protectedRoute array and the http_request_method
        # also matches up this means the user is trying to access a protected route
        isAccessingProtectedRoute = False
        for protectedRoute in protectedRoutes:
            route_pattern = protectedRoute.get('route')
            http_request_method = protectedRoute.get('http_request_method')
            if re.match(route_pattern, request.path) and request.method == http_request_method:
                isAccessingProtectedRoute = True
                break
        # If the user is not accessing a protected route we just return "RouteStatus.NOT_PROTECTED".
        if not isAccessingProtectedRoute:
            return RouteStatus.NOT_PROTECTED
        # You can access all your cookies from the "cookies" property on the "request" object.
        # It is represented by a dictionary, so you can use [] notation or the "get()" method.
        # "get()" method is better because it won't create an error if I provide an invalid key
        # whereas [] notation does. 
        token = request.cookies.get('token')
        if not token:
            raise CustomError('Missing Token', StatusCodes.UNAUTHORIZED)
        # We can use the "decode" method on the "jwt" object to convert a jwt to the original payload.
        # All you have to do is pass in the keyword arguments of jwt, key, and alogorithm. All 3 are 
        # mandatory. 
        decoded = jwt.decode(
            jwt = token,
            key = os.getenv('JWT_SECRET'),
            algorithms = ['HS256']
        )
        # To make it so only users with ceratiain roles are allowed to access a route we will use the 
        # forbiddenRoutes list/array. An it will have dictionaries inside of it that follow the format
        # of "route" and "authorized_roles"
        forbiddenRoutes = [
            {
                # Only a user of role "USER" should be able to update their profile information.
                # Because we will generate non changeable "ADMIN" role accounts from the owner panel.
                # And "OWNER" has root access of database anyways so it doesn't matter. 
                "route": "/api/v1/user/updateProfile",
                "authorized_roles": ['USER', 'OWNER']
            },
            {
                # Only a user of role "USER" and "OWNER" should be able to update their password.
                # Because all "ADMIN" role accounts have set login credentials. 
                "route": "/api/v1/user/updatePassword",
                "authorized_roles": ['USER', 'OWNER']
            },
            {
                # Only a user of role "OWNER" should be able to create a user of role "ADMIN".
                "route": "/api/v1/user/generate_admin",
                "authorized_roles": ['OWNER']
            },
            {
                # Only a user of role "OWNER" should be able to get access to overview data
                "route": '/api/v1/user/overviewData',
                "authorized_roles": ['OWNER']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to create an institution
                "route": "/api/v1/institution",
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to update/delete an institution
                "route": "^/api/v1/institution/[a-zA-Z0-9-]+$",
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to update an institution image
                "route": '^/api/v1/institution/[a-zA-Z0-9-]+/image$',
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to create an educator
                "route": '/api/v1/educator',
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to update/delete an educator
                "route": '^/api/v1/educator/[a-zA-Z0-9-]+$',
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to update an educators image
                "route": '^/api/v1/educator/[a-zA-Z0-9-]+/image$',
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to create a course
                "route": '/api/v1/course',
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to update/delete a course
                "route": '^/api/v1/course/[a-zA-Z0-9-]+$',
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "OWNER" and "ADMIN" should be able to update a course syllabus
                "route": '^/api/v1/course/[a-zA-Z0-9-]+/syllabus$',
                "authorized_roles": ['OWNER', 'ADMIN']
            },
            {
                # Only a user of role "USER" should be able to create a review
                "route": '/api/v1/review',
                "authorized_roles": ['USER']
            },
            {
                # Only a user of role "USER" should be able to update/delete a review
                "route": '^/api/v1/review/[a-zA-Z0-9-]+$',
                "authorized_roles": ['USER']
            }
        ]
        # Iterate through each dictionary within the "forbiddenRoutes" list/array and check if the user who
        # is trying to access this resource is actually allowed to.
        for forbiddenRoute in forbiddenRoutes:
            route_pattern = forbiddenRoute.get('route')
            authorized_roles = forbiddenRoute.get('authorized_roles')
            role = decoded.get('role')
            if re.match(route_pattern, request.path) and role not in authorized_roles:
                raise CustomError('You are not authorized to access this route!', StatusCodes.FORBIDDEN)
        # According to Flask Documentation the best practice for storing data throughout the
        # lifecycle of a request is by saving it in the "g" object from "flask". "g" stands for global
        # namespace and its used to hold any data you want.
        g.user = {"userId": decoded.get('userId')}
    except CustomError as error:
        return jsonify({"msg": error.args[0]}), error.statusCode
    except Exception as error:
        return jsonify({"msg": "Failed to Authenticate User"}), StatusCodes.UNAUTHORIZED