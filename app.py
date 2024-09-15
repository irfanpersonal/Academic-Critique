from flask import Flask, send_from_directory # To create a Flask application
from sqlalchemy.orm import DeclarativeBase
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from utils.enums import RouteStatus
from middleware.error_handler import errorHandler
from middleware.authentication import authentication
from blueprints.auth import auth_blueprint # Auth Blueprint
from blueprints.user import user_blueprint # User Blueprint
from blueprints.institution import institution_blueprint # Institution Blueprint
from blueprints.educator import educator_blueprint # Educator Blueprint
from blueprints.course import course_blueprint # Course Blueprint
from blueprints.review import review_blueprint # Review Blueprint
from flask_migrate import Migrate # To update database post initial creation. 
# Import All Models for Application
from models.User import getUserClass
from models.Institution import getInstitutionClass
from models.Educator import getEducatorClass
from models.Course import getCourseClass
from models.Review import getReviewClass
from dotenv import load_dotenv 
import os
load_dotenv()

# To create a flask Application use the Flask constructor located on the flask package.
# It requires that you pass in "__name__". It uses this in the background to help
# set things up in the Flask Application.
app = Flask(__name__, static_folder="client/build")

# CORS (Cross Origin Resource Sharing) is a way for you to specify what domain other than your own
# is allowed to interact with you. For example say your front end is running on localhost:3000 (CRA)
# and your backend is living on localhost:4000, you can't just interact with one another like this.
# Because of the "same origin policy" modern web browsers follow. Which means they must be the same
# for it to work. And localhost:4000 is not equal to localhost:3000. To fix this just setup CORS in 
# your backend. CORS on its own allows all domains to interact with your server. Of course you can 
# be specific like I did here.
if not os.getenv('FLASK_ENV') == 'production':
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Limiting All File Uploads to 2MB
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024

# To create middleware for all routes you can use the "before_request" decorator located on 
# an app/blueprint object. And with it create a function that does whatever logic you need it to before a
# route is hit.
@app.before_request
def handleAuthentication():
    returnValueOfAuthenticationFunctionCall = authentication()
    # Now if the authentication doesn't return a RouteStatus set to NOT_PROTECTED we know we 
    # got a response back and we can just return it.
    if returnValueOfAuthenticationFunctionCall != RouteStatus.NOT_PROTECTED:
        return returnValueOfAuthenticationFunctionCall

# Here we are applying the blueprint/router to our Flask Application. 
app.register_blueprint(auth_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(institution_blueprint)
app.register_blueprint(educator_blueprint)
app.register_blueprint(course_blueprint)
app.register_blueprint(review_blueprint)

# To handle all errors 
@app.errorhandler(Exception)
def handleError(e):
    return errorHandler(e)

# The first step in setting up our Database with the Flask Application is creating a class that inherits
# from either DeclarativeBase or DeclarativeBaseNoMeta. Additionally we can also provide some logic that 
# all models when created will share.
class Base(DeclarativeBase):
    pass

# Setting up the Database URL for SQLAlchemy to connect to
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URL')

# Here we are saying that the databases, base model class should be "Base". This makes
# it so that all the models we create inherit from this. It also makes the variable "db"
# have access to the Model class (db.Model) and ability to execute queries (db.session)
db = SQLAlchemy(model_class=Base)

# To initialize/setup "flask-migrate" (because by default Flask does not perform changes/updates to our tables 
# after the initial creation), add the following line of code: migrate = Migrate(app, db)
# This will allow us to make changes to our actual database tables.
migrate = Migrate(app, db)

# This connects the SQLAlchemy tool to your Flask Application
db.init_app(app)

# For debugging purposes we will iterate over all of our models to make sure SQLAlchemy 
# is aware of them. This way we can see if some model is missing. Just makes the
# development a lot easier. This also allows “flask_migrate” to recognize current/new
# models to make sure they get updated.
User = getUserClass(db)
Institution = getInstitutionClass(db)
Educator = getEducatorClass(db)
Course = getCourseClass(db)
Review = getReviewClass(db)
models = [User, Institution, Educator, Course, Review]
if not os.getenv('FLASK_ENV') == 'production':
    for model in models:
        print(f"Recognized {model.__name__} Model")

port = os.getenv('PORT') or 4000
if __name__ == '__main__':
    try:
        # This starts up the actual Flask Application, using the WSGI called "werkzeug" which is the default 
        # one. Its unable to handle multiple requests at a time. We will eventually switch to a WSGI that does
        # during production. "werkzeug" stands for "tool" which makes sense because its meant for development 
        # purposes as your still working on the project.
        # app.run(
        #     port = port, 
        #     debug = True
        # )
        # For production we will use the "WSGI" called "waitress" because it supports Windows, Mac, and Linux. 
        # And we obviously can't use the built in WSGI from flask called "werkzeug" because its strictly meant
        # for development purposes. Thats why it doesn't handle many requests at once. But with a production
        # WSGI like "waitress" we can run our flask application at a certain port and thread count. You can think
        # of a thread count as the amount of workers processing requests. A good conservative range is 4 to 8. 
        # from waitress import serve
        # serve(
        #     app = app,
        #     port = port,
        #     threads = 4
        # )
        
        # To serve your Create React App with your Flask Backend
        # To make the routing for the front end work
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def serve(path):
            if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
                return send_from_directory(app.static_folder, path)
            else:
                return send_from_directory(app.static_folder, 'index.html')
            
        # To make the images on the site actually load in
        @app.route('/static/uploads/<path:filename>')
        def uploaded_file(filename):
            return send_from_directory(os.path.join(app.root_path, 'static/uploads'), filename)

        if os.getenv('FLASK_ENV') == 'production':
            from waitress import serve
            print(f"Server listening on port {port}...")
            # Once it hits serve() it won't execute any code after
            serve(
                app = app,
                port = port,
                threads = 4
            )
        else:
            # No need because the "werkzeug" WSGI makes it very clear what port its running on.
            # print(f"Server listening on port {port}...")
            # Once it hits app.run() it won't execute any code after
            app.run(
                port = port, 
                debug = True
            )
    except Exception as error:
        print(f"Error: {error}")