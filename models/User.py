from sqlalchemy import String, Enum, DateTime, func, event
from sqlalchemy.orm import Mapped, mapped_column, validates, relationship
from utils.enums import Role, Country
from utils.isValidEmail import isValidEmail
import bcrypt
import uuid

# We will use this function to return the User class. It will have access to the class Model (db.Model)
# which is needed for creating an actual model that is recognized by SQLAlchemy.
def getUserClass(db):
    class User(db.Model):
    # To set a table name 
        __tablename__ = "users"

    # To define your columns, follow this format
    # column_name = Mapped[type for column] = mapped_column(specific details about type for column, constraints)
        id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid.uuid4)
        username: Mapped[str] = mapped_column(String(12), nullable=False, unique=True)
        email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
        password: Mapped[str] = mapped_column(String(60), nullable=False)
        country: Mapped[Country] = mapped_column(Enum(Country), nullable=False)
        role: Mapped[Role] = mapped_column(Enum(Role), nullable=False, default=Role.USER)
        createdAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now())
        updatedAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

        # Associations

        # A User has many Reviews
        reviews = relationship("Review", back_populates="user")
        # The first arugment you pass in to the "relationship()" method is the model you are creating a relationship 
        # for. And you'll notice that its in the form of a string that matches the "Class" name. So if you have a table
        # called "users" but you defined the table in a class called "User" than thats what you set as the value in the form
        # of a string in the first argument. And the keyword argument of "back_populates" is used to define what we would
        # like to name our column on the table we are trying to create a relationship for.

        # It's not enough for you to set "nullable" to "False". You can still enter in an empty string for a column 
        # and satisfy the critiera for a row to be added to the users table. So to fix that we will use whats called the
        # validates decorator and pass in bunch of strings matching the column name we would like the validator logic 
        # we define to run on.
        @validates('username', 'password')
        def validate_not_empty(self, _, value):
            if not value or value.strip() == '':
                raise ValueError("Please check all inputs!")
            return value
        
        @validates('email')
        def emailChecker(self, key, value):
            if not value or value.strip() == '':
                raise ValueError("Please check all inputs!")
            elif not isValidEmail(value):
                raise ValueError(f"Please provide a valid {key}!")
            return value

    # To define an instance method just use the "def" keyword as you usually do. This is super useful when you are 
    # trying to execute some logic within your objet. For example if you are comparing password this would be 
    # awesome. 
        def comparePassword(self, guess: str) -> bool:
            isCorrect = bcrypt.checkpw(guess.encode('utf-8'), self.password.encode('utf-8'))
            return isCorrect

    # To define the string representation of an instance/object of type User
        def __repr__(self):
            return f"User('{self.id}', '{self.username}', '{self.email}', '{self.password}', '{self.country}', '{self.role}', '{self.createdAt}', '{self.updatedAt}')"

    # To define any "Events" also known as "Middleware Hooks", you first need to define a listener function 
    # which is defined by it having these 3 paramters: mapper, connection, and target. Once you have successfully 
    # created that function you then need to load in "sqlalchemy.event" and pass into it the 3 arguments of model, 
    # mapper event, and listener function. This does the actual linking to the model.  

    def beforeCreatingUserListener(mapper, connection, target):
        # Before creating a User we want to hash the password. Because making it human readable allows bad
        # actors to easily steal account information
        randomBytes = bcrypt.gensalt(10)
        # Note: In Pythons version of "bcrypt" you don't have access to the "hash" method, instead we use
        # whats called the "hashpw()" method. And the first argument is the value you would like to hash, and 
        # the second is the salt (randombytes). The important thing to keep in mind is that the first argument
        # MUST be in the form of a byte object. So use the "encode()" method along with a character encoding
        # type to use the "hashpw()" method.
        target.password = bcrypt.hashpw(target.password.encode('utf-8'), randomBytes)

    event.listen(User, 'before_insert', beforeCreatingUserListener)

    # Return the class "User"
    return User