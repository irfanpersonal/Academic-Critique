from flask import request
from utils.http_status_codes import StatusCodes
from utils.custom_response import response
from utils.custom_error import CustomError
from utils.getDatabaseInformation import getDatabaseInformation
from pydanticModels.Course import isValidCourseChecker
from datetime import datetime
from werkzeug.utils import secure_filename
from utils.deleteFile import deleteFile
import math

def getAllCourses():
    db, Models = getDatabaseInformation()
    queryParameters = request.args.to_dict()
    filters = []
    if queryParameters.get('name'):
        name = f"%{queryParameters.get('name')}%"
        filters.append(Models.Course.name.ilike(name))
    if queryParameters.get('educator_id'):
        educator_id = f"%{queryParameters.get('educator_id')}%"
        filters.append(Models.Course.educator_id.ilike(educator_id))
    if queryParameters.get('institution_id'):
        institution_id = f"%{queryParameters.get('institution_id')}%"
        filters.append(Models.Course.institution_id.ilike(institution_id))
    page = int(queryParameters.get('page', 1))
    limit = int(queryParameters.get('limit', 10))
    skip = (page - 1) * limit
    courses = db.session.query(Models.Course).filter(*filters).offset(skip).limit(limit).all()
    totalCourses = db.session.query(Models.Course).filter(*filters).count()
    numberOfPages = math.ceil(totalCourses / limit)
    formatted_courses = [
        {
            "id": course.id,
            "name": course.name,
            "code": course.code,
            "capacity": course.capacity,
            "format": course.format.name,
            "type": course.type.name,
            "cost": course.cost,
            "syllabus": course.syllabus,
            "level": course.level.name,
            "rating": course.rating,
            # Now I have access to course.educator which will grab the data we got 
            # from the educator_id.
            "educator": {
                "name": course.educator.name
            },
            "educator_id": course.educator_id,
            # Now I have access to course.institution which will grab the data we got 
            # from the institution_id
            "institution": {
                "name": course.institution.name
            },
            "institution_id": course.institution_id,
            "createdAt": course.createdAt,
            "updatedAt": course.updatedAt
        }
        for course in courses
    ]
    return response(
        json = {"courses": formatted_courses, "totalCourses": totalCourses, "numberOfPages": numberOfPages},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def createCourse():
    db, Models = getDatabaseInformation()
    # First need to check if everything is valid besides the syllabus.
    isValidCourse = isValidCourseChecker(
        value = {
            "name": request.form.get('name'),
            "code": request.form.get('code'),
            "capacity": request.form.get('capacity'),
            "format": request.form.get('format'),
            "type": request.form.get('type'),
            "cost": request.form.get('cost'),
            "level": request.form.get('level'),
            "educator_id": request.form.get('educator_id'),
            "institution_id": request.form.get('institution_id')
        }
    )
    educator = db.session.query(Models.Educator).filter(Models.Educator.id == request.form.get('educator_id')).one_or_none()
    institution = db.session.query(Models.Institution).filter(Models.Institution.id == request.form.get('institution_id')).one_or_none()
    if not isValidCourse:
        raise CustomError('Please check all inputs for course creation!', StatusCodes.BAD_REQUEST)
    if not educator or not institution:
        raise CustomError('Please provide valid educator/institution id!', StatusCodes.NOT_FOUND)
    syllabus = request.files.get('syllabus')
    if not syllabus:
        raise CustomError('Please provide a value for syllabus!', StatusCodes.BAD_REQUEST)
    elif not syllabus.content_type.startswith('application/pdf'):
        raise CustomError('Syllabus File type must be PDF!', StatusCodes.BAD_REQUEST)
    # Save the Syllabus
    # Note: Never use the filename the way it is. Bad actors can set the filename to something malicious and create a security risk. 
    # So always make sure its secure. And you can do so by doing this: import werkzeug.utils import secure_filename
    # Now just pass in the filename to "secure_filename" and you should be good to go. 
    destination = f"static/uploads/syllabus/syllabus_{datetime.now()}_{secure_filename(syllabus.filename)}"
    syllabus.save(
        dst = destination
    )
    course = Models.Course(
        name = request.form.get('name'),
        code = request.form.get('code'),
        capacity = request.form.get('capacity'),
        format = request.form.get('format'),
        type = request.form.get('type'),
        cost = request.form.get('cost'),
        syllabus = f'/{destination}',
        level = request.form.get('level'),
        educator_id = request.form.get('educator_id'),
        institution_id = request.form.get('institution_id')
    )
    db.session.add(course)
    db.session.commit()
    return response(
        json = {
            "course": {
                "id": course.id,
                "name": course.name,
                "code": course.code,
                "capacity": course.capacity,
                "format": course.format.name,
                "type": course.type.name,
                "cost": course.cost,
                "syllabus": course.syllabus,
                "level": course.level.name,
                "educator_id": course.educator_id,
                "educator": {
                    "name": course.educator.name
                },
                "institution_id": course.institution_id,
                "institution": {
                    "name": course.institution.name
                }
            }
        },
        statusCode = StatusCodes.CREATED,
        contentType = 'application/json'
    )

def getSingleCourse(course_id):
    db, Models = getDatabaseInformation()
    course = db.session.query(Models.Course).filter(Models.Course.id == course_id).one_or_none()
    if not course:
        raise CustomError('No Course Found with the ID Provided!', StatusCodes.NOT_FOUND)
    return response(
        json = {
            "course": {
                "id": course.id,
                "name": course.name,
                "code": course.code,
                "capacity": course.capacity,
                "format": course.format.name,
                "type": course.type.name,
                "cost": course.cost,
                "syllabus": course.syllabus,
                "level": course.level.name,
                "rating": course.rating,
                "educator_id": course.educator_id,
                "educator": {
                    "name": course.educator.name,
                    "description": course.educator.description,
                    "email": course.educator.email,
                    "department": course.educator.department.name,
                    "status": course.educator.status.name,
                    "image": course.educator.image,
                    "rating": course.educator.rating
                },
                "institution_id": course.institution_id,
                "institution": {
                    "name": course.institution.name,
                    "description": course.institution.description,
                    "rating": course.institution.rating
                }
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updateSingleCourse(course_id):
    db, Models = getDatabaseInformation()
    course = db.session.query(Models.Course).filter(Models.Course.id == course_id).one_or_none()
    if not course:
        raise CustomError('No Course Found with the ID Provided!', StatusCodes.NOT_FOUND)
    name = request.form.get('name')
    code = request.form.get('code')
    capacity = request.form.get('capacity')
    format = request.form.get('format')
    type = request.form.get('type')
    cost = request.form.get('cost')
    level = request.form.get('level')
    if name:
        course.name = name
    if code:
        course.code = code
    if capacity:
        course.capacity = capacity
    if format:
        course.format = format
    if type:
        course.type = type
    if cost:
        course.cost = cost
    if level:
        course.level = level
    db.session.commit()
    return response(
        json = {
            "course": {
                "name": course.name,
                "code": course.code,
                "capacity": course.capacity,
                "format": course.format.name,
                "type": course.type.name,
                "cost": course.cost,
                "syllabus": course.syllabus,
                "level": course.level.name,
                "rating": course.rating,
                "educator_id": course.educator_id,
                "educator": {
                    "name": course.educator.name,
                    "description": course.educator.description,
                    "email": course.educator.email,
                    "department": course.educator.department.name,
                    "status": course.educator.status.name,
                    "image": course.educator.image,
                    "rating": course.educator.rating
                },
                "institution_id": course.institution_id,
                "institution": {
                    "name": course.institution.name,
                    "description": course.institution.description,
                    "rating": course.institution.rating
                }
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updateSingleCourseSyllabus(course_id):
    db, Models = getDatabaseInformation()
    course = db.session.query(Models.Course).filter(Models.Course.id == course_id).one_or_none()
    if not course:
        raise CustomError('No Course Found with the ID Provided!', StatusCodes.NOT_FOUND)
    syllabus = request.files.get('syllabus')
    if not syllabus:
        raise CustomError('Please provide a value for syllabus!', StatusCodes.BAD_REQUEST)
    elif not syllabus.content_type.startswith('application/pdf'):
        raise CustomError('Syllabus File Type must be PDF!', StatusCodes.BAD_REQUEST)
    # Delete Old Syllabus
    syllabusLocationWithoutFirstSlash = course.syllabus[1:]
    deleteFile(syllabusLocationWithoutFirstSlash)
    # Upload New Syllabus
    destination = f"static/uploads/syllabus/syllabus_{datetime.now()}_{secure_filename(syllabus.filename)}"
    syllabus.save(
        dst = destination
    )
    # Update Course with new Destination
    course.syllabus = f"/{destination}"
    db.session.commit()
    return response(
        json = {"course_syllabus": f"/{destination}"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def deleteSingleCourse(course_id):
    db, Models = getDatabaseInformation()
    # Find the Course
    course = db.session.query(Models.Course).filter(Models.Course.id == course_id).one_or_none()
    if not course:
        raise CustomError('No Course Found with the ID Provided!', StatusCodes.NOT_FOUND)
    # Delete the Course
    db.session.delete(course)
    db.session.commit()
    return response(
        json = {"msg": "Deleted Single Course!"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )