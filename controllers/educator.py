from flask import request
from utils.http_status_codes import StatusCodes
from utils.custom_response import response
from utils.custom_error import CustomError
from utils.getDatabaseInformation import getDatabaseInformation
from pydanticModels.Educator import isValidEducatorChecker
from werkzeug.utils import secure_filename
from utils.deleteFile import deleteFile
from datetime import datetime
import math

def getAllEducators():
    db, Models = getDatabaseInformation()
    queryParameters = request.args.to_dict()
    filters = []
    if queryParameters.get('name'):
        name = f"%{queryParameters.get('name')}%"
        filters.append(Models.Educator.name.ilike(name))
    if queryParameters.get('institution_id'):
        institution_id = f"%{queryParameters.get('institution_id')}%"
        filters.append(Models.Educator.institution_id.ilike(institution_id))
    page = int(queryParameters.get('page', 1))
    limit = int(queryParameters.get('limit', 10))
    skip = (page - 1) * limit
    educators = db.session.query(Models.Educator).filter(*filters).offset(skip).limit(limit).all()
    totalEducators = db.session.query(Models.Educator).filter(*filters).count()
    numberOfPages = math.ceil(totalEducators / limit)
    formatted_educators = [
        {
            "id": educator.id,
            "name": educator.name,
            "description": educator.description,
            "email": educator.email,
            "department": educator.department.name,
            "status": educator.status.name,
            "image": educator.image,
            "rating": educator.rating,
            "institution_id": educator.institution_id,
            # Now I have access to educators.insitution which will grab the data we got 
            # from the instiution_id.
            "institution": {
                "name": educator.institution.name
            },
            "createdAt": educator.createdAt,
            "updatedAt": educator.updatedAt
        }
        for educator in educators
    ]
    return response(
        json = {"educators": formatted_educators, "totalEducators": totalEducators, "numberOfPages": numberOfPages},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def createEducator():
    db, Models = getDatabaseInformation()
    # First need to check if everything is valid besides the image.
    isValidEducator = isValidEducatorChecker(
        value = {
            "name": request.form.get('name'),
            "description": request.form.get('description'),
            "email": request.form.get('email'),
            "department": request.form.get('department'),
            "status": request.form.get('status'),
            "institution_id": request.form.get("institution_id")
        }
    )
    if not isValidEducator or not request.files.get('image') or not request.files.get('image').content_type.startswith('image/'):
        raise CustomError('Please check all inputs for educator!', StatusCodes.BAD_REQUEST)
    # Check if a Educator with the name already exists, this is to make sure we don't get
    # a duplicate error. 
    educatorWithEmailAlreadyExists = db.session.query(Models.Educator).filter(Models.Educator.email == request.form.get('email')).one_or_none()
    if educatorWithEmailAlreadyExists:
        raise CustomError('An educator with that email exists already!', StatusCodes.BAD_REQUEST)
    # Check if the institution_id links to an actual Instition
    isInstitutionIdValid = db.session.query(Models.Institution).filter(Models.Institution.id == request.form.get('institution_id')).one_or_none()
    if not isInstitutionIdValid:
        raise CustomError('No Institution Found with the ID Provided!', StatusCodes.NOT_FOUND)
    # Save the Image/PFP
    image = request.files.get('image')
    destination = f"static/uploads/educator/educator_{datetime.now()}_{request.form.get('name')}_{secure_filename(image.filename)}"
    image.save(
        dst = destination
    )
    # Add Educator to Database
    educator = Models.Educator(
        name = request.form.get('name'),
        description = request.form.get('description'),
        email = request.form.get('email'),
        department = request.form.get('department'),
        status = request.form.get('status'),
        image = f"/{destination}",
        institution_id = request.form.get('institution_id')
    )
    # # If you fail to provide the "institution_id" upto this point you won't get an error. But when you
    # # do "db.session.commit" it will complain. So keep that in mind.
    db.session.add(educator)
    db.session.commit()
    return response(
        json = {
            "educator": {
                "id": educator.id,
                "name": educator.name,
                "description": educator.description,
                "email": educator.email,
                "department": educator.department.name,
                "status": educator.status.name,
                "image": educator.image,
                "institution_id": educator.institution_id
            }
        },
        statusCode = StatusCodes.CREATED,
        contentType = 'application/json'
    )

def getSingleEducator(educator_id):
    db, Models = getDatabaseInformation()
    educator = db.session.query(Models.Educator).filter(Models.Educator.id == educator_id).one_or_none()
    if not educator:
        raise CustomError('No Educator Found with the ID Provided!', StatusCodes.NOT_FOUND)
    total_courses = len(educator.courses)
    average_cost = sum(course.cost for course in educator.courses) / total_courses if total_courses else 0
    return response(
        json = {
            "educator": {
                "id": educator.id,
                "name": educator.name,
                "description": educator.description,
                "email": educator.email,
                "department": educator.department.name,
                "status": educator.status.name,
                "image": educator.image,
                "rating": educator.rating,
                "institution_id": educator.institution_id,
                "institution": {
                    "id": educator.institution.id,
                    "name": educator.institution.name,
                    "country": educator.institution.country.name,
                    "website": educator.institution.website,
                    "contact_email": educator.institution.contact_email,
                    "rating": educator.institution.rating
                },
                "course_stats": {
                    "total_courses": total_courses,
                    "average_cost": average_cost
                }
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updateSingleEducator(educator_id):
    db, Models = getDatabaseInformation()
    educator = db.session.query(Models.Educator).filter(Models.Educator.id == educator_id).update(
        values = {**request.form}
    )
    db.session.commit()
    if not educator:
        raise CustomError('No Educator Found with the ID Provided!', StatusCodes.BAD_REQUEST)
    updatedEducator = db.session.query(Models.Educator).filter(Models.Educator.id == educator_id).one_or_none()
    total_courses = len(updatedEducator.courses)
    average_cost = sum(course.cost for course in updatedEducator.courses) / total_courses if total_courses else 0
    return response(
        json = {
            "educator": {
                "name": updatedEducator.name,
                "description": updatedEducator.description,
                "email": updatedEducator.email,
                "department": updatedEducator.department.name,
                "status": updatedEducator.status.name,
                "image": updatedEducator.image,
                "rating": updatedEducator.rating,
                "institution_id": updatedEducator.institution_id,
                "institution": {
                    "id": updatedEducator.institution.id,
                    "name": updatedEducator.institution.name,
                    "country": updatedEducator.institution.country.name,
                    "website": updatedEducator.institution.website,
                    "contact_email": updatedEducator.institution.contact_email,
                    "rating": updatedEducator.institution.rating
                },
                "course_stats": {
                    "total_courses": total_courses,
                    "average_cost": average_cost
                }
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updateSingleEducatorImage(educator_id):
    db, Models = getDatabaseInformation()
    educator = db.session.query(Models.Educator).filter(Models.Educator.id == educator_id).one_or_none()
    if not educator:
        raise CustomError('No Educator Found with the ID Provided!', StatusCodes.NOT_FOUND)
    image = request.files.get('image')
    if not image:
        raise CustomError('Please provide a value for image!', StatusCodes.BAD_REQUEST)
    elif not image.content_type.startswith('image/'):
        raise CustomError('Please provide a file of type image!', StatusCodes.BAD_REQUEST)
    # Delete Old Image
    imageLocationWithoutFirstSlash = educator.image[1:]
    deleteFile(imageLocationWithoutFirstSlash)
    # Upload New Image
    destination = f"static/uploads/educator/educator_{datetime.now()}_{secure_filename(image.filename)}"
    image.save(
        dst = destination
    )
    # Update Instition Image Value
    educator.image = f"/{destination}"
    db.session.commit()
    return response(
        json = {"educator_image": f"/{destination}"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def deleteSingleEducator(educator_id):
    db, Models = getDatabaseInformation()
    # Find the Educator
    educator = db.session.query(Models.Educator).filter(Models.Educator.id == educator_id).one_or_none()
    if not educator:
        raise CustomError('No Educator Found with the ID Provided!', StatusCodes.NOT_FOUND)
    # Delete the educator
    db.session.delete(educator)
    db.session.commit()
    return response(
        json = {"msg": "Deleted Single Educator!"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )