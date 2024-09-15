import flask

# To create a blueprint/router we can use the "Blueprint()" constructor method from the "flask"
# package. All you need to do is pass in 3 important keyword arguments (options)
# name - name of the blueprint/router
# import_name - just pass in __name__, its used internally by the "Blueprint" constructor for 
# it to function properly
# url_prefix - the equivalent of app.use(HERE, routerName) from Express Apps
auth_blueprint = flask.Blueprint(
    name = "auth", 
    import_name = __name__, 
    url_prefix = "/api/v1/auth"
)

# Load in your controller logic
from controllers.auth import register, login, logout

# We will also make use of the "appContextWrapper" function which takes in some function and makes it run 
# inside of the "app.app_context()". This is so we can use commands like "db.session.execute()", "db.session.add()",
# and "db.session.commit()".
from utils.appContextWrapper import appContextWrapper

# Now just use the blueprint/router to create handlers for specific routes. And pass in the method that
# should be used for that route in the "methods" keyword argument which takes in a list/array.
@auth_blueprint.route('/register', methods=['POST'])
def handleRegister():
    return appContextWrapper(register)

@auth_blueprint.route('/login', methods=['POST'])
def handleLogin():
    return appContextWrapper(login)

@auth_blueprint.route('/logout', methods=['POST'])
def handleLogout():
    return appContextWrapper(logout)