from flask import request
from utils.http_status_codes import StatusCodes
from utils.custom_response import response
from utils.custom_error import CustomError
from utils.getDatabaseInformation import getDatabaseInformation
from sqlalchemy import and_
import math

def getAllReviews(resource_id):
    db, Models = getDatabaseInformation()
    queryParameters = request.args.to_dict()
    filters = [
        Models.Review.type_id == resource_id
    ]
    if queryParameters.get('sort'):
        print('sort')
    page = int(queryParameters.get('page', 1))
    limit = int(queryParameters.get('limit', 10))
    skip = (page - 1) * limit
    reviews = db.session.query(Models.Review).filter(*filters).offset(skip).limit(limit).all()
    totalReviews = db.session.query(Models.Review).filter(*filters).count()
    numberOfPages = math.ceil(totalReviews / limit)
    formatted_reviews = [
        {
            "id": review.id,
            "title": review.title,
            "rating": review.rating,
            "content": review.content,
            "type_id": review.type_id,
            "type": review.type.name,
            "user_id": review.user_id,
            "user": {
                "username": review.user.username,
                "country": review.user.country.name
            },
            "createdAt": review.createdAt,
            "updatedAt": review.updatedAt
        }
        for review in reviews
    ]
    return response(
        json = {"reviews": formatted_reviews, "totalReviews": totalReviews, "numberOfPages": numberOfPages},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def createReview(user_data):
    db, Models = getDatabaseInformation()
    if not request.form.get('type') or not request.form.get('type_id'):
        raise CustomError('Please provide a review type/type_id!', StatusCodes.BAD_REQUEST)
    alreadyMadeAReviewForThisSpecificResourceType = db.session.query(Models.Review).filter(
        and_(
            Models.Review.user_id == user_data.get('userId'),
            Models.Review.type == request.form.get('type'),
            Models.Review.type_id == request.form.get('type_id')
        )
    ).one_or_none()
    if alreadyMadeAReviewForThisSpecificResourceType:
        raise CustomError('You already made a review for this!', StatusCodes.BAD_REQUEST)
    review = Models.Review(
        title = request.form.get('title'),
        rating = request.form.get('rating'),
        content = request.form.get('content'),
        type = request.form.get('type'),
        type_id = request.form.get('type_id'),
        user_id = user_data.get('userId')
    )
    db.session.add(review)
    db.session.commit()
    return response(
        json = {
            "review": {
                "id": review.id,
                "title": review.title,
                "rating": review.rating,
                "content": review.content,
                "type_id": review.type_id,
                "type": review.type.name,
                "user_id": review.user_id,
                "user": {
                    "username": review.user.username,
                    "country": review.user.country.name
                },
                "createdAt": review.createdAt,
                "updatedAt": review.updatedAt
            }
        },
        statusCode = StatusCodes.CREATED,
        contentType = 'application/json'
    )

def updateReview(user_data, review_id):
    db, Models = getDatabaseInformation()
    userId = user_data.get('userId')
    review = db.session.query(Models.Review).filter(
        Models.Review.id == review_id,
        Models.Review.user_id == userId
    ).one_or_none()
    if not review:
        raise CustomError('No Review Found with the ID Provided!', StatusCodes.NOT_FOUND)
    title = request.form.get('title')
    rating = request.form.get('rating')
    content = request.form.get('content')
    if title:
        review.title = title
    if rating:
        review.rating = rating
    if content:
        review.content = content
    db.session.commit()
    return response(
        json = {
            "review": {
                "title": review.title,
                "rating": review.rating,
                "content": review.content,
                "type_id": review.type_id,
                "type": review.type.name,
                "user_id": review.user_id,
                "user": {
                    "username": review.user.username,
                    "country": review.user.country.name
                },
                "createdAt": review.createdAt,
                "updatedAt": review.updatedAt
            }
        },
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )

def deleteReview(user_data, review_id):
    db, Models = getDatabaseInformation()
    userId = user_data.get('userId')
    review = db.session.query(Models.Review).filter(
        Models.Review.id == review_id,
        Models.Review.user_id == userId
    ).one_or_none()
    if not review:
        raise CustomError('No Review Found with the ID Provided!', StatusCodes.NOT_FOUND)
    db.session.delete(review)
    db.session.commit()
    return response(
        json = {"msg": "Deleted Review"},
        statusCode = StatusCodes.OK,
        contentType = 'application/json'
    )