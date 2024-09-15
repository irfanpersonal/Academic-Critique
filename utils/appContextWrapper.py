# This function is designed to wrap around every controller. The reason why is because 
# when you use the "db.session.add" or "db.session.commit" commands you will get the 
# following error: "The current Flask app is not registered with this 'SQLAlchemy' 
# instance. Did you forget to call 'init_app', or did you create multiple 'SQLAlchemy' 
# instances." The reason why you are getting this error is because Flask is unaware 
# of what database it should apply these commands to. But when you use the "app.app_context()"
# context manager you let Flask know exactly what you are tying to execute these commands
# to which is the "app" you defined in the "app.py" file.

def appContextWrapper(function):
    from app import app
    with app.app_context():
        return function()