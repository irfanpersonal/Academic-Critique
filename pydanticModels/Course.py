from typing_extensions import Annotated
from pydantic import BaseModel, StringConstraints, Field
from utils.enums import CourseType, CourseLevel, CourseFormatType

class CoursePydanticModel(BaseModel):
    name: Annotated[str, StringConstraints(
        max_length = 256
    )]
    code: Annotated[str, StringConstraints(
        max_length = 256
    )]
    capacity: Annotated[int, Field(
        gt = 0
    )]
    format: CourseFormatType
    type: CourseType
    cost: Annotated[int, Field(
        gt = 0
    )]
    level: CourseLevel
    educator_id: Annotated[str, StringConstraints(
        max_length = 36
    )]
    institution_id: Annotated[str, StringConstraints(
        max_length = 36
    )]

def isValidCourseChecker(value: dict):
    try:
        valid = CoursePydanticModel(**value)
        return valid
    except Exception as error:
        print(error)
        return False