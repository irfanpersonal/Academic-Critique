import flask
from controllers.user import showCurrentUser, getAllUsers, getSingleUser, updateProfile, updatePassword, generateAdmin, getOverviewData
from utils.appContextWrapper import appContextWrapper

user_blueprint = flask.Blueprint(
    name = "user", 
    import_name = __name__, 
    url_prefix = "/api/v1/user"
)

@user_blueprint.route("/", methods=['GET'])
def handleGetAllUsers():
    return appContextWrapper(getAllUsers)

@user_blueprint.route("/showCurrentUser", methods=['GET'])
def handleShowCurrentUser():
    # Now the controller logic does not have access to the data we passed into the "g" object. 
    # But we do have access to it in this function.  
    user_data = flask.g.get('user')
    # Now if we pass it directly in like so: return appContextWrapper(showCurrentUser(user_data))
    # We will get an error because it will invoke the function right away. And our "appContextWrapper"
    # function is setup in a way where we need just the function declaration not the returned value 
    # of it. So to make sure that won't happen we will create whats called an anonymous function 
    # using lambda. This way, the function is not invoked immediately but rather when appContextWrapper 
    # decides to call it.
    return appContextWrapper(lambda: showCurrentUser(user_data))

@user_blueprint.route("/generate_admin", methods=['POST'])
def handleGenerateAdmin():
    return appContextWrapper(generateAdmin)

@user_blueprint.route("/overviewData", methods=['GET'])
def handleGetOverviewData():
    return appContextWrapper(getOverviewData)

@user_blueprint.route("/updateProfile", methods=['PATCH'])
def handleUpdateUser():
    user_data = flask.g.get('user')
    return appContextWrapper(lambda: updateProfile(user_data))

@user_blueprint.route("/updatePassword", methods=["PATCH"])
def handleUpdatePassword():
    user_data = flask.g.get('user')
    return appContextWrapper(lambda: updatePassword(user_data))

# To create a route that takes a "Route Parameter" follow this format: "<converter_aka_type:route_paramter_name>",
# so it would look something like this: "/resource/<string:user_id>", notice how instead of "str" I used "string"
# this is because you have a set amount of options. And instead of str its referred to as string. So you have to 
# keep this in mind when defining a route parameter. Now all you have to do is add the route parameter as a paramter
# into your route handler.
@user_blueprint.route("/<string:username>", methods=['GET'])
def handleGetSingleUser(username):
    return appContextWrapper(lambda : getSingleUser(username))