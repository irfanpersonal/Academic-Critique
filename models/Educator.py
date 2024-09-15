from sqlalchemy import String, Float, Enum, DateTime, func, ForeignKey, event, text
from sqlalchemy.orm import Mapped, mapped_column, validates, relationship
from utils.enums import EducatorStatus, EducatorDepartment
from utils.isValidEmail import isValidEmail
from utils.deleteFile import deleteFile
import uuid

def getEducatorClass(db):
    class Educator(db.Model):
    # To set a table name 
        __tablename__ = "educators"

    # To define your columns, follow this format
    # column_name = Mapped[type for column] = mapped_column(specific details about type for column, constraints)
        id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid.uuid4)
        name: Mapped[str] = mapped_column(String(256), nullable=False)
        description: Mapped[str] = mapped_column(String(1000), nullable=False)
        email: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
        department: Mapped[EducatorDepartment] = mapped_column(Enum(EducatorDepartment), nullable=False)
        status: Mapped[EducatorStatus] = mapped_column(Enum(EducatorStatus), nullable=False, default=EducatorStatus.ACTIVE)
        image: Mapped[str] = mapped_column(String(512), nullable=False)
        rating: Mapped[float] = mapped_column(Float, nullable=False, default=0)
        createdAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now())
        updatedAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

        # Associations

        # A Educator must be tied to Single Institution
        institution_id: Mapped[str] = mapped_column(String(36), ForeignKey('institutions.id', ondelete="CASCADE"), nullable=False) # Make sure to set nullable=False so you cannot leave the value for this column NULL
        institution = relationship("Institution", back_populates="educators")

        # A Educator has many Courses
        courses = relationship("Course", back_populates="educator", cascade="all, delete-orphan") # By setting cascade to all, delete-orphan we make it so that all referenced courses are deleted

        # It's not enough for you to set "nullable" to "False". You can still enter in an empty string for a column 
        # and satisfy the critiera for a row to be added to the educators table. So to fix that we will use whats called the
        # validates decorator and pass in a bunch of strings matching the column name we would like the validator logic 
        # we define to run on. Keep in mind that the @validates function logic won't execute on 'foreign key' columns.
        @validates('name', 'description', 'department', 'status', 'image')
        def validate_not_empty(self, key, value):
            if not value or value.strip() == '':
                raise ValueError("Please check all inputs!")
            return value
        
        @validates('email')
        def validEmail(self, _, value):
            if not value or value.strip() == '' or not isValidEmail(value):
                raise ValueError("Please check all inputs!")
            return value

    # To define the string representation of an instance/object of type Educator
        def __repr__(self):
            return f"Educator('{self.id}', '{self.name}', '{self.description}', '{self.email}', '{self.department}', '{self.status}', '{self.image}', '{self.rating}', '{self.institution_id}', '{self.institution}', '{self.createdAt}', '{self.updatedAt}')"

    # Before Deleting a Educator Remove Image and Associated Reviews
    def beforeDeletingEducatorListener(mapper, connection, target):
        imageLocationWithoutFirstSlash = target.image[1:]
        deleteFile(imageLocationWithoutFirstSlash)
        connection.execute(text(
            f"""
                DELETE FROM reviews WHERE type = 'EDUCATOR' AND type_id = '{target.id}' 
            """
        ))

    event.listen(Educator, 'before_delete', beforeDeletingEducatorListener)

    return Educator