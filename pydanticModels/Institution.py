# In Python the most popular input validation tool is called "pydantic". Sort of like how in
# JS/TS you have Zod. Python has "pydantic". To get started we first have to install the
# third party package called "pydantic", so like this.

# pip install pydantic

# Then we have to load it in and destructure the "BaseModel", so like this

# from pydantic import BaseModel

# Now to create a Pydantic Model we have to create a class that inherits from "BaseModel". 
# This is a requirement for ALL Pydantic Models.

from typing_extensions import Annotated
from pydantic import BaseModel, StringConstraints, EmailStr, Field

from utils.enums import InstitutionType, Country, AcceptanceRate, AccreditationStatus

class InstitutionPydanticModel(BaseModel):
    # Now we can start defining our model requirements
    # Note: Notice how I don't use "constr", this is because it doesn't play well with static analysis tools
    # According to the official docs instead use "Annotated" from "typing_extensions" and "StringConstraints"
    # from "pydantic". So Annoted takes a list/array where the first argument is the type, and the second is 
    # options if any, so something like "StringContraints".
    name: Annotated[str, StringConstraints(
        max_length = 256
    )]
    description: Annotated[str, StringConstraints(
        max_length = 1000
    )]
    address: Annotated[str, StringConstraints(
        max_length = 256
    )]
    # To check if a valid email  
    contact_email: Annotated[EmailStr, StringConstraints(
        max_length = 256
    )]
    type: InstitutionType # You can also just set a type to Enum, so it must be a value from it
    size: Annotated[int, Field(
        gt = 0
    )]
    country: Country
    tuition: Annotated[int, Field(
        gt = 0
    )]
    acceptanceRate: AcceptanceRate
    accreditationStatus: AccreditationStatus
    website: str

def isValidInstitutionChecker(value: dict):
    try:
        valid = InstitutionPydanticModel(**value)
        return valid
    except Exception:
        return False