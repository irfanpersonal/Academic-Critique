from typing_extensions import Annotated
from pydantic import BaseModel, StringConstraints, EmailStr
from utils.enums import EducatorDepartment, EducatorStatus

class EducatorPydanticModel(BaseModel):
    name: Annotated[str, StringConstraints(
        max_length = 256
    )]
    description: Annotated[str, StringConstraints(
        max_length = 1000
    )]
    email: Annotated[EmailStr, StringConstraints(
        max_length = 256
    )]
    department: EducatorDepartment
    status: EducatorStatus
    institution_id: Annotated[str, StringConstraints(
        max_length = 36
    )]

def isValidEducatorChecker(value: dict):
    try:
        valid = EducatorPydanticModel(**value)
        return valid
    except Exception:
        return False