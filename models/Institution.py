from sqlalchemy import String, Integer, Float, Enum, DateTime, func, event, text
from sqlalchemy.orm import Mapped, mapped_column, validates, relationship
from utils.enums import InstitutionType, AccreditationStatus, AcceptanceRate, Country
from utils.isValidEmail import isValidEmail
from utils.deleteFile import deleteFile
import uuid

def getInstitutionClass(db):
    class Institution(db.Model):
    # To set a table name 
        __tablename__ = "institutions"

    # To define your columns, follow this format
    # column_name = Mapped[type for column] = mapped_column(specific details about type for column, constraints)
        id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid.uuid4)
        name: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
        description: Mapped[str] = mapped_column(String(1000), nullable=False)
        address: Mapped[str] = mapped_column(String(256), nullable=False)
        contact_email: Mapped[str] = mapped_column(String(256), nullable=False)
        type: Mapped[InstitutionType] = mapped_column(Enum(InstitutionType), nullable=False)
        # There is no keyword argument like "min" or "max" in the "mapped_column"
        size: Mapped[int] = mapped_column(Integer, nullable=False)
        website: Mapped[str] = mapped_column(String(256), nullable=False)
        rating: Mapped[float] = mapped_column(Float, nullable=False, default=0)
        image: Mapped[str] = mapped_column(String(512), nullable=False)
        tuition: Mapped[int] = mapped_column(Integer, nullable=False)
        acceptanceRate: Mapped[AcceptanceRate] = mapped_column(Enum(AcceptanceRate), nullable=False)
        accreditationStatus: Mapped[AccreditationStatus] = mapped_column(Enum(AccreditationStatus), nullable=False)
        country: Mapped[Country] = mapped_column(Enum(Country), nullable=False)
        createdAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now())
        updatedAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

        # Associations

        # A Institution has many Educators
        # educators = relationship("Educator", back_populates="institution", passive_deletes=True) # By setting passive_deletes to True here we make it so that when a instution is deleted instead of loading in the educators to delete it by the ORM it will instead do it on the Database level
        educators = relationship("Educator", back_populates="institution", cascade="all, delete-orphan") 

        # A Institution has many Courses
        courses = relationship("Course", back_populates="institution")

        # It's not enough for you to set "nullable" to "False". You can still enter in an empty string for a column 
        # and satisfy the critiera for a row to be added to the institutions table. So to fix that we will use whats called the
        # validates decorator and pass in a bunch of strings matching the column name we would like the validator logic 
        # we define to run on.
        # Note: You can't create more than 1 validate logic function for the same column, you must also return the 
        # value otherwise it will be set as NULL.
        @validates('name', 'description', 'address', 'website', 'image')
        def validate_not_empty(self, _, value):
            if not value or value.strip() == '':
                raise ValueError("Please check all inputs!")
            return value
        
        @validates('contact_email')
        def emailChecker(self, _, value):
            if not value or value.strip() == '' or not isValidEmail(value):
                raise ValueError('Please check all inputs!')
            return value
        
        @validates('size', 'tuition')
        def greaterThanZero(self, key, value):
            if not value or int(value) < 1:
                raise ValueError(f"Please provide a valid {key} value for institution creation!")
            # You must return the value otherwise it will be set as NULL: (MySQLdb.IntegrityError) (1048, "Column 'size' cannot be null")
            return value

    # To define the string representation of an instance/object of type Institution
        def __repr__(self):
            return f"Institution('{self.id}', '{self.name}', '{self.description}', '{self.address}', '{self.contact_email}', '{self.type}', '{self.size}', '{self.website}', '{self.rating}', '{self.image}', '{self.createdAt}', '{self.updatedAt}')"

    # Before Deleting a Institution Remove Image and Associated Reviews
    def beforeDeletingInstitutionListener(mapper, connection, target):
        imageLocationWithoutFirstSlash = target.image[1:]
        deleteFile(imageLocationWithoutFirstSlash)
        connection.execute(text(
            f"""
                DELETE FROM reviews WHERE type = 'INSTITUTION' AND type_id = '{target.id}' 
            """
        ))

    event.listen(Institution, 'before_delete', beforeDeletingInstitutionListener)

    return Institution