from sqlalchemy import String, Integer, Enum, DateTime, func, ForeignKey, event, text
from sqlalchemy.orm import Mapped, mapped_column, validates, relationship, Mapper
from sqlalchemy.engine import Connection
from utils.enums import ReviewType
import uuid

def getReviewClass(db):
    class Review(db.Model):
    # To set a table name 
        __tablename__ = "reviews"

    # To define your columns, follow this format
    # column_name = Mapped[type for column] = mapped_column(specific details about type for column, constraints)
        id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid.uuid4)
        title: Mapped[str] = mapped_column(String(256), nullable=False)
        rating: Mapped[int] = mapped_column(Integer, nullable=False)
        content: Mapped[str] = mapped_column(String(1000), nullable=False)
        type: Mapped[ReviewType] = mapped_column(Enum(ReviewType), nullable=False)
        type_id: Mapped[str] = mapped_column(String(256), nullable=False)
        createdAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now())
        updatedAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

        # Associations

        # A Review must be tied to Single User
        user_id: Mapped[str] = mapped_column(String(36), ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
        user = relationship("User", back_populates="reviews")

        # It's not enough for you to set "nullable" to "False". You can still enter in an empty string for a column 
        # and satisfy the critiera for a row to be added to the courses table. So to fix that we will use whats called the
        # validates decorator and pass in a bunch of strings matching the column name we would like the validator logic 
        # we define to run on.
        @validates('title', 'content')
        def isValid(self, key, value):
            if not value or value.strip() == '':
                raise ValueError(f'Please provide a valid value for {key}!')
            return value

        @validates('rating')
        def inRange(self, key, value):
            if not value or value.strip() == '':
                raise ValueError(f'Please provide a valid value for {key}!')
            elif int(value) < 1 or int(value) > 5:
                raise ValueError('Rating must be between 1 and 5')
            return value
        
        @validates('type_id')
        def verifyEntity(self, key, value):
            from utils.getDatabaseInformation import getDatabaseInformation
            db, Models = getDatabaseInformation()
            if not value or value.strip() == '':
                raise ValueError(f'Please provide a valid type id!')
            model = None
            if self.type == 'INSTITUTION':
                model = Models.Institution
            elif self.type == 'EDUCATOR':
                model = Models.Educator
            else:
                model = Models.Course
            doesItEvenExist = db.session.query(model).where(model.id == value).one_or_none()
            if not doesItEvenExist:
                raise ValueError('Please provide a valid id!')
            return value

        # To define the string representation of an instance/object of type Educator
        def __repr__(self):
            return f"Review('{self.id}', '{self.title}', '{self.rating}', '{self.content}', '{self.type}', '{self.type_id}', '{self.createdAt}', '{self.updatedAt}')"
        
    # To define any "Events" also known as "Middleware Hooks", you first need to define a listener function 
    # which is defined by it having these 3 paramters: mapper, connection, and target. Once you have successfully 
    # created that function you then need to load in the "event" property from "sqlalchemy" package. So like this
    # from sqlalchemy import event
    # And from the "event" property we want to chain the "listen()" method and pass into it the 3 arguments of model, 
    # mapper event, and listener function. This does the actual linking to the model.  

    def AfterCreatingUpdatingAndDeletingReviewListener(mapper: Mapper, connection: Connection, target: Review):
        # mapper - represents the mapping between database table and python class 
        # connection - connection to database, where you can perform RAW SQL queries
        # target - actual instance of the object
        # After creating/updating/deleting a Review we want to update the averageRating of the resource.
        type = target.type
        # During creation type is equal to "INSTITUTION" or "EDUCATOR" or "COURSE" but during updating its equal to
        # ReviewType.INSTITUTION or ReviewType.EDUCATOR or ReviewType.COURSE.
        if isinstance(type, ReviewType):
            newValue = None
            if type.name == 'INSTITUTION':
                newValue = 'institutions'
            elif type.name == 'EDUCATOR':
                newValue = 'educators'
            elif type.name == 'COURSE':
                newValue = 'courses'
            type = newValue
        else:
            newValue = None
            if type == 'INSTITUTION':
                newValue = 'institutions'
            elif type == 'EDUCATOR':
                newValue = 'educators'
            elif type == 'COURSE':
                newValue = 'courses'
            type = newValue
        type_id = target.type_id
        reviews = connection.execute(text(
            f"""
                SELECT * FROM reviews WHERE type_id = '{type_id}'
            """
        )).fetchall()
        rating = 0
        for review in reviews:
            rating += review.rating
        divideBy = None
        if len(reviews):
            divideBy = len(reviews)
        else:
            divideBy = 1
        newRating = rating / divideBy
        connection.execute(text(
            f"""
                UPDATE {type} SET rating = '{newRating}' WHERE id = '{type_id}'
            """
        ))

    event.listen(Review, 'after_insert', AfterCreatingUpdatingAndDeletingReviewListener)
    event.listen(Review, 'after_update', AfterCreatingUpdatingAndDeletingReviewListener)
    event.listen(Review, 'after_delete', AfterCreatingUpdatingAndDeletingReviewListener)

    return Review