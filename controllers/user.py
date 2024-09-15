import math
from flask import request
from utils.enums import Role, Country
from utils.http_status_codes import StatusCodes
from utils.custom_response import response
from utils.custom_error import CustomError
from utils.getDatabaseInformation import getDatabaseInformation
from datetime import datetime, timedelta
from sqlalchemy import func
from faker import Faker
from utils.sendgrid import sendEmail
import bcrypt

def showCurrentUser(user_data):
    userId = user_data.get('userId')
    db, Models = getDatabaseInformation()
    user = db.session.query(Models.User).filter(Models.User.id == userId).one_or_none()
    return response(
        json = {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "country": user.country.name,
                "role": user.role.name
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def getAllUsers():
    db, Models = getDatabaseInformation()
    queryParameters = request.args.to_dict()
    filters = [
        Models.User.role == 'USER'
    ]
    if queryParameters.get('username'):
        filters.append(Models.User.username.ilike(queryParameters.get('username')))
    if queryParameters.get('country'):
        filters.append(Models.User.country.ilike(queryParameters.get('country')))
    page = int(queryParameters.get('page', 1))
    limit = int(queryParameters.get('limit', 10))
    skip = (page - 1) * limit
    users = db.session.query(Models.User).filter(*filters).offset(skip).limit(limit).all()
    totalUsers = db.session.query(Models.User).filter(*filters).count()
    numberOfPages = math.ceil(totalUsers / limit)
    formatted_users = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "country": user.country.name,
            "role": user.role.name,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt
        }
        for user in users
    ]
    return response(
        json = {"users": formatted_users, "totalUsers": totalUsers, "numberOfPages": numberOfPages},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def getSingleUser(username):
    db, Models = getDatabaseInformation()
    user = db.session.query(Models.User).filter(Models.User.username == username).one_or_none()
    if user.role.name == 'OWNER' or not user:
        raise CustomError('No User Found with the Username Provided', StatusCodes.NOT_FOUND)
    return response(
        json = {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "country": user.country.name,
                "role": user.role.name,
                "createdAt": user.createdAt,
                "updatedAt": user.updatedAt
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def generateAdmin():
    db, Models = getDatabaseInformation()
    fake = Faker()
    if not request.form.get('email'):
        raise CustomError('Please provide email for admin creation!', StatusCodes.BAD_REQUEST)
    email = request.form.get('email')
    userWithThisEmailExistsAlready = db.session.query(Models.User).filter(Models.User.email == email).one_or_none()
    if userWithThisEmailExistsAlready:
        raise CustomError('A user with this email already exists!', StatusCodes.BAD_REQUEST)
    fakeUsername = fake.user_name()
    fakePassword = fake.password()
    user = Models.User(
        username = fakeUsername[:10],
        email = email,
        password = fakePassword,
        country = Country.UNITED_STATES,
        role = Role.ADMIN
    )
    db.session.add(user)
    db.session.commit()
    sendEmail(
        data = {
            "to_emails": request.form.get('email'),
            "subject": 'Academic Critique - Admin User Information',
            "html_content": f"""
                <h1>Academic Critique</h1>
                <p>To login to your Admin account on <strong>Academic Critique</strong> use the following credentials</p>
                <p>Email: {email}</p>
                <p>Password: {fakePassword}</p>
                <p><b>Note: </b>Please be aware that these login credentials are fixed and cannot be altered. It is essential to keep this information confidential and avoid sharing it with anyone.</p>
            """
        }
    )
    return response(
        json = {"msg": "Successfully Created Admin Account!"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def getOverviewData():
    db, Models = getDatabaseInformation()
    user_count = db.session.query(Models.User).filter(Models.User.role != 'OWNER').count()
    institution_count = db.session.query(Models.Institution).count()
    educator_count = db.session.query(Models.Educator).count()
    course_count = db.session.query(Models.Course).count()
    review_count = db.session.query(Models.Review).count()

    # Get the current date and calculate the date 12 months ago
    today = datetime.today()
    twelve_months_ago = today - timedelta(days=365)

    # Query for users, institutions, educators, courses, and reviews created in the last 12 months
    users_by_month = db.session.query(
        func.date_format(Models.User.createdAt, '%Y-%m').label('month'),
        func.count(Models.User.id)
    ).filter(
        Models.User.createdAt >= twelve_months_ago,
        Models.User.role != 'OWNER'
    ).group_by('month').order_by('month').all()

    institutions_by_month = db.session.query(
        func.date_format(Models.Institution.createdAt, '%Y-%m').label('month'),
        func.count(Models.Institution.id)
    ).filter(
        Models.Institution.createdAt >= twelve_months_ago
    ).group_by('month').order_by('month').all()

    educators_by_month = db.session.query(
        func.date_format(Models.Educator.createdAt, '%Y-%m').label('month'),
        func.count(Models.Educator.id)
    ).filter(
        Models.Educator.createdAt >= twelve_months_ago
    ).group_by('month').order_by('month').all()

    courses_by_month = db.session.query(
        func.date_format(Models.Course.createdAt, '%Y-%m').label('month'),
        func.count(Models.Course.id)
    ).filter(
        Models.Course.createdAt >= twelve_months_ago
    ).group_by('month').order_by('month').all()

    reviews_by_month = db.session.query(
        func.date_format(Models.Review.createdAt, '%Y-%m').label('month'),
        func.count(Models.Review.id)
    ).filter(
        Models.Review.createdAt >= twelve_months_ago
    ).group_by('month').order_by('month').all()

    # Format the data for easy use in Recharts or other charting libraries
    data = {
        "users_by_month": [{ "month": row[0], "count": row[1] } for row in users_by_month],
        "institutions_by_month": [{ "month": row[0], "count": row[1] } for row in institutions_by_month],
        "educators_by_month": [{ "month": row[0], "count": row[1] } for row in educators_by_month],
        "courses_by_month": [{ "month": row[0], "count": row[1] } for row in courses_by_month],
        "reviews_by_month": [{ "month": row[0], "count": row[1] } for row in reviews_by_month]
    }

    return response(
        json = {
            "overviewData": {
                "user_count": user_count,
                "institution_count": institution_count,
                "educator_count": educator_count,
                "course_count": course_count,
                "review_count": review_count,
                "chart_data": data
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updateProfile(user_data):
    db, Models = getDatabaseInformation()
    userId = user_data.get('userId')
    user = db.session.execute(db.select(Models.User).where(Models.User.id == userId)).first()[0]
    # The awesome thing about SQLAlchemy is that when I try to make some changes to the values, the validation
    # runs by default. Which is super awesome and keeps me in check.
    if request.form.get('username'):
        user.username = request.form.get('username')
    if request.form.get('email'):
        user.email = request.form.get('email')
    if request.form.get('country'):
        user.country = request.form.get('country')
    db.session.commit() # To apply the changes
    return response(
        json = {"user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "country": user.country.name,
            "role": user.role.name,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt
        }},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def updatePassword(user_data):
    db, Models = getDatabaseInformation()
    userId = user_data.get('userId')
    if not request.form.get('oldPassword') or not request.form.get('newPassword'):
        raise CustomError('Please provide oldPassword and newPassword!', StatusCodes.BAD_REQUEST)
    user = db.session.execute(db.select(Models.User).where(Models.User.id == userId)).first()[0]
    # Check if the oldPassword provided matches with the password of the user
    isCorrect = user.comparePassword(request.form.get('oldPassword'))
    if not isCorrect:
        raise CustomError('Incorrect Old Password!', StatusCodes.BAD_REQUEST)
    # Hash and Set new Password
    randomBytes = bcrypt.gensalt(10)
    user.password = bcrypt.hashpw(request.form.get('newPassword').encode('utf-8'), randomBytes)
    db.session.commit()
    return response(
        json = {"msg": "Successfully Updated Password!"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )