import flask
from controllers.review import getAllReviews, createReview, updateReview, deleteReview
from utils.appContextWrapper import appContextWrapper
 
review_blueprint = flask.Blueprint(
    name = "review", 
    import_name = __name__, 
    url_prefix = "/api/v1/review"
)

@review_blueprint.route("/", methods=['POST'])
def handleCreateReview():
    user_data = flask.g.get('user')
    return appContextWrapper(lambda: createReview(user_data))

@review_blueprint.route("/<string:resource_id>", methods=['GET'])
def handleGetAllReviews(resource_id):
    return appContextWrapper(lambda: getAllReviews(resource_id))

@review_blueprint.route("/<string:review_id>", methods=['PATCH'])
def handleUpdateReview(review_id):
    user_data = flask.g.get('user')
    return appContextWrapper(lambda: updateReview(user_data, review_id))

@review_blueprint.route("/<string:review_id>", methods=['DELETE'])
def handleDeleteReview(review_id):
    user_data = flask.g.get('user')
    return appContextWrapper(lambda: deleteReview(user_data, review_id))