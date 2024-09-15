from flask import request
from utils.http_status_codes import StatusCodes
from utils.custom_response import response
from utils.custom_error import CustomError
from utils.getDatabaseInformation import getDatabaseInformation
from utils.deleteFile import deleteFile
from pydanticModels.Institution import isValidInstitutionChecker
from werkzeug.utils import secure_filename
from sqlalchemy import desc
from datetime import datetime
import math

def getAllInstitutions():
    db, Models = getDatabaseInformation()
    queryParameters = request.args.to_dict()
    filters = []
    if queryParameters.get('name'):
        name = f"%{queryParameters.get('name')}%"
        filters.append(Models.Institution.name.ilike(name))
    if queryParameters.get('type'):
        type = f"%{queryParameters.get('type')}%"
        filters.append(Models.Institution.type.ilike(type))
    if queryParameters.get('ratingMin') or queryParameters.get('ratingMax'):
        if queryParameters.get('ratingMin'):
            filters.append(Models.Institution.rating >= queryParameters.get('ratingMin'))
        if queryParameters.get('ratingMax'):
            filters.append(Models.Institution.rating <= queryParameters.get('ratingMax'))
    if queryParameters.get('sizeMin') or queryParameters.get('sizeMax'):
        if queryParameters.get('sizeMin'):
            filters.append(Models.Institution.size >= queryParameters.get('sizeMin'))
        if queryParameters.get('sizeMax'):
            filters.append(Models.Institution.size <= queryParameters.get('sizeMax'))
    if queryParameters.get('tuitionMin') or queryParameters.get('tuitionMax'):
        if queryParameters.get('tuitionMin'):
            filters.append(Models.Institution.tuition >= queryParameters.get('tuitionMin'))
        if queryParameters.get('tuitionMax'):
            filters.append(Models.Institution.tuition <= queryParameters.get('tuitionMax'))
    if queryParameters.get('country'):
        country = f"%{queryParameters.get('country')}%"
        filters.append(Models.Institution.country.ilike(country))
    if queryParameters.get('acceptanceRate'):
        acceptanceRate = f"%{queryParameters.get('acceptanceRate')}%"
        filters.append(Models.Institution.acceptanceRate.ilike(acceptanceRate))
    if queryParameters.get('accreditationStatus'):
        accreditationStatus = f"%{queryParameters.get('accreditationStatus')}%"
        filters.append(Models.Institution.accreditationStatus.ilike(accreditationStatus))
    page = int(queryParameters.get('page', 1))
    limit = int(queryParameters.get('limit', 10))
    skip = (page - 1) * limit
    institutions = None
    if queryParameters.get("sort"):
        if queryParameters.get('sort') == 'Creation':
            institutions = db.session.query(Models.Institution).filter(*filters).order_by(desc(Models.Institution.createdAt)).offset(skip).limit(limit).all()
        elif queryParameters.get('sort') == 'Tuition':
            institutions = db.session.query(Models.Institution).filter(*filters).order_by(desc(Models.Institution.tuition)).offset(skip).limit(limit).all()
        elif queryParameters.get('sort') == 'Size':
            institutions = db.session.query(Models.Institution).filter(*filters).order_by(desc(Models.Institution.size)).offset(skip).limit(limit).all()
    else:
        institutions = db.session.query(Models.Institution).filter(*filters).offset(skip).limit(limit).all()
    totalInstitutions = db.session.query(Models.Institution).filter(*filters).count()
    numberOfPages = math.ceil(totalInstitutions / limit)
    formatted_institutions = [
        {
            "id": institution.id,
            "name": institution.name,
            "description": institution.description,
            "address": institution.address,
            "contact_email": institution.contact_email,
            "type": institution.type.name,
            "size": institution.size,
            "website": institution.website,
            "rating": institution.rating,
            "image": institution.image,
            "tuition": institution.tuition,
            "acceptanceRate": institution.acceptanceRate.name,
            "accreditationStatus": institution.accreditationStatus.name,
            "country": institution.country.name,
            # Now we have access to "institution.educators which is an array of values"
            "educators": [
                {
                    "name": educator.name
                }
                for educator in institution.educators
            ],
            "createdAt": institution.createdAt,
            "updatedAt": institution.updatedAt
        }
        for institution in institutions
    ]
    return response(
        json = {"institutions": formatted_institutions, "totalInstitutions": totalInstitutions, "numberOfPages": numberOfPages},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def createInstitution():
    db, Models = getDatabaseInformation()   
    # First need to check if everything is valid besides the image.
    isValidInstitution = isValidInstitutionChecker(
        value = {
            "name": request.form.get('name'),
            "description": request.form.get('description'),
            "type": request.form.get('type'),
            "address": request.form.get('address'),
            "contact_email": request.form.get('contact_email'),
            "website": request.form.get('website'),
            "size": request.form.get('size'),
            "country": request.form.get('country'),
            "tuition": request.form.get('tuition'),
            "acceptanceRate": request.form.get('acceptanceRate'),
            "accreditationStatus": request.form.get('accreditationStatus')
        }
    ) 
    if not isValidInstitution or not request.files.get('image'):
        raise CustomError('Please check all inputs!', StatusCodes.BAD_REQUEST)
    # Check if a Institution with the name already exists, this is to make sure we don't get
    # a duplicate error. 
    alreadyExists = db.session.execute(db.select(Models.Institution).where(Models.Institution.name == request.form.get('name')))
    if len(list(alreadyExists)):
        raise CustomError('A similar institution with that name already exists!', StatusCodes.BAD_REQUEST)
    # Save the Image
    image = request.files.get('image')
    if not image.content_type.startswith('image/'):
        raise CustomError('Please provide an image!', StatusCodes.BAD_REQUEST)
    destination = f"static/uploads/institution/institution_{datetime.now()}_{secure_filename(image.filename)}"
    image.save(
        dst = destination
    )
    # Add Institution to Database
    institution = Models.Institution(
        name = request.form.get('name'),
        description = request.form.get('description'),
        type = request.form.get('type'),
        address = request.form.get('address'),
        contact_email = request.form.get('contact_email'),
        website = request.form.get('website'),
        size = request.form.get('size'),
        image = f"/{destination}",
        country = request.form.get('country'),
        tuition = request.form.get('tuition'),
        acceptanceRate = request.form.get('acceptanceRate'),
        accreditationStatus = request.form.get('accreditationStatus')
    )
    db.session.add(institution)
    db.session.commit()
    return response(
        json = {
            "institution": {
                "name": institution.name,
                "description": institution.description,
                "type": institution.type.name,
                "address": institution.address,
                "contact_email": institution.contact_email,
                "website": institution.website,
                "size": institution.size,
                "image": institution.image,
                "tuition": institution.tuition,
                "acceptanceRate": institution.acceptanceRate.name,
                "accreditationStatus": institution.accreditationStatus.name,
                "country": institution.country.name,
            }
        },
        statusCode = StatusCodes.CREATED,
        contentType = 'application/json'
    )

def getSingleInstitution(institution_id):
    db, Models = getDatabaseInformation()
    institution = db.session.query(Models.Institution).filter(Models.Institution.id == institution_id).one_or_none()
    if not institution:
        raise CustomError('No Institution Found with the ID Provided!', StatusCodes.NOT_FOUND)
    return response(
        json = {
            "institution": {
                "name": institution.name,
                "description": institution.description,
                "type": institution.type.name,
                "address": institution.address,
                "contact_email": institution.contact_email,
                "website": institution.website,
                "size": institution.size,
                "rating": institution.rating,
                "image": institution.image,
                "tuition": institution.tuition,
                "acceptanceRate": institution.acceptanceRate.name,
                "accreditationStatus": institution.accreditationStatus.name,
                "country": institution.country.name,
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updateSingleInstitution(institution_id):
    db, Models = getDatabaseInformation()
    institution = db.session.query(Models.Institution).filter(Models.Institution.id == institution_id).one_or_none()
    if not institution:
        raise CustomError('No Institution Found with the ID Provided!', StatusCodes.BAD_REQUEST)
    name = request.form.get('name')
    description = request.form.get('description')
    address = request.form.get('address')
    type = request.form.get('type')
    contact_email = request.form.get('contact_email')
    website = request.form.get('website')
    size = request.form.get('size')
    acceptanceRate = request.form.get('acceptanceRate')
    accreditationStatus = request.form.get('accreditationStatus')
    country = request.form.get('country')
    tuition = request.form.get('tuition')
    if name:
        institution.name = name
    if description:
        institution.description = description
    if address: 
        institution.address = address
    if type:
        institution.type = type
    if contact_email:
        institution.contact_email = contact_email
    if website:
        institution.website = website
    if size:
        institution.size = size
    if tuition:
        institution.tuition = tuition
    if country:
        institution.country = country
    if acceptanceRate:
        institution.acceptanceRate = acceptanceRate
    if accreditationStatus:
        institution.accreditationStatus = accreditationStatus
    db.session.commit()
    return response(
        json = {
            "institution": {
                "id": institution.id,
                "name": institution.name,
                "description": institution.description,
                "address": institution.address,
                "contact_email": institution.contact_email,
                "type": institution.type.name,
                "size": institution.size,
                "website": institution.website,
                "rating": institution.rating,
                "image": institution.image,
                "tuition": institution.tuition,
                "acceptanceRate": institution.acceptanceRate.name,
                "accreditationStatus": institution.accreditationStatus.name,
                "country": institution.country.name,
                "createdAt": institution.createdAt,
                "updatedAt": institution.updatedAt
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updateSingleInstitutionImage(institution_id):
    db, Models = getDatabaseInformation()
    institution = db.session.query(Models.Institution).filter(Models.Institution.id == institution_id).one_or_none()
    if not institution:
        raise CustomError('No Institution Found with the ID Provided!', StatusCodes.NOT_FOUND)
    image = request.files.get('image')
    if not image:
        raise CustomError('Please provide a value for image!', StatusCodes.BAD_REQUEST)
    if not image.content_type.startswith('image/'):
        raise CustomError('Please provide a file of type image!', StatusCodes.BAD_REQUEST)
    # Delete Old Image
    imageLocationWithoutFirstSlash = institution.image[1:]
    deleteFile(imageLocationWithoutFirstSlash)
    # Upload New Image
    destination = f"static/uploads/institution/institution_{datetime.now()}_{secure_filename(image.filename)}"
    image.save(
        dst = destination
    )
    # Update Instition Image Value
    institution.image = f"/{destination}"
    db.session.commit()
    return response(
        json = {"institution_image": f"/{destination}"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def deleteSingleInstitution(institution_id):
    db, Models = getDatabaseInformation()
    # Find the institution
    institution = db.session.query(Models.Institution).filter(Models.Institution.id == institution_id).one_or_none()
    if not institution:
        raise CustomError('No Institution Found with the ID Provided!', StatusCodes.NOT_FOUND)
    # Delete the institution
    db.session.delete(institution)
    db.session.commit()
    return response(
        json = {"msg": "Deleted Single Institution!"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )