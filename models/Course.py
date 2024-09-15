from sqlalchemy import String, Integer, Float, Enum, DateTime, func, ForeignKey, event, text
from sqlalchemy.orm import Mapped, mapped_column, validates, relationship
from utils.enums import CourseFormatType, CourseType, CourseLevel
from utils.deleteFile import deleteFile
import uuid

def getCourseClass(db):
    class Course(db.Model):
    # To set a table name 
        __tablename__ = "courses"

    # To define your columns, follow this format
    # column_name = Mapped[type for column] = mapped_column(specific details about type for column, constraints)
        id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid.uuid4)
        name: Mapped[str] = mapped_column(String(256), nullable=False)
        code: Mapped[str] = mapped_column(String(256), nullable=False)
        capacity: Mapped[int] = mapped_column(Integer, nullable=False)
        format: Mapped[CourseFormatType] = mapped_column(Enum(CourseFormatType), nullable=False, default=CourseFormatType.IN_PERSON)
        type: Mapped[CourseType] = mapped_column(Enum(CourseType), nullable=False, default=CourseType.LECTURE)
        cost: Mapped[int] = mapped_column(Integer, nullable=False)
        syllabus: Mapped[str] = mapped_column(String(512), nullable=False)
        level: Mapped[CourseLevel] = mapped_column(Enum(CourseLevel), nullable=False, default=CourseLevel.INTRODUCTORY)
        rating: Mapped[float] = mapped_column(Float, nullable=False, default=0)
        createdAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now())
        updatedAt: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

        # Associations

        # A Course must be tied to Single Educator
        educator_id: Mapped[str] = mapped_column(String(36), ForeignKey('educators.id', ondelete="CASCADE"), nullable=False)
        educator = relationship("Educator", back_populates="courses")

        # A Course must be tied to Single Institution
        institution_id: Mapped[str] = mapped_column(String(36), ForeignKey('institutions.id', ondelete="CASCADE"), nullable=False)
        institution = relationship("Institution", back_populates="courses")
        
        # It's not enough for you to set "nullable" to "False". You can still enter in an empty string for a column 
        # and satisfy the critiera for a row to be added to the courses table. So to fix that we will use whats called the
        # validates decorator and pass in a bunch of strings matching the column name we would like the validator logic 
        # we define to run on.
        @validates('name', 'code', 'syllabus')
        def validate_not_empty(self, _, value):
            if not value or value.strip() == '':
                raise ValueError("Please check all inputs!")
            return value
        
        @validates('capacity', 'cost')
        def greaterThanZero(self, key, value):
            if not value or int(value) < 1:
                raise ValueError(f"Please provide a valid {key} value for course creation!")
            # You must return the value otherwise it will be set as NULL: (MySQLdb.IntegrityError) (1048, "Column 'size' cannot be null")
            return value
        
    # To define the string representation of an instance/object of type Educator
        def __repr__(self):
            return f"Course('{self.id}', '{self.name}', '{self.code}', '{self.capacity}', '{self.format}', '{self.type}', '{self.cost}', '{self.syllabus}', '{self.level}', '{self.createdAt}', '{self.educator_id}', '{self.institution_id}', '{self.updatedAt}')"

    # Before Deleting a Course Remove Syllabus and Associated Reviews
    def beforeDeletingCourseListener(mapper, connection, target):
        syllabusLocationWithoutFirstSlash = target.syllabus[1:]
        deleteFile(syllabusLocationWithoutFirstSlash)
        connection.execute(text(
            f"""
                DELETE FROM reviews WHERE type = 'COURSE' AND type_id = '{target.id}' 
            """
        ))

    event.listen(Course, 'before_delete', beforeDeletingCourseListener)

    return Course