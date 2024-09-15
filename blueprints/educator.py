import flask
from controllers.educator import getAllEducators, createEducator, getSingleEducator, updateSingleEducator, updateSingleEducatorImage, deleteSingleEducator
from utils.appContextWrapper import appContextWrapper
 
educator_blueprint = flask.Blueprint(
    name = "educator", 
    import_name = __name__, 
    url_prefix = "/api/v1/educator"
)

@educator_blueprint.route("/", methods=['GET'])
def handleGetAllEducators():
    return appContextWrapper(getAllEducators)

@educator_blueprint.route("/", methods=['POST'])
def handleEducatorCreation():
    return appContextWrapper(createEducator)

@educator_blueprint.route("/<string:educator_id>", methods=['GET'])
def handleGetSingleEducator(educator_id):
    return appContextWrapper(lambda: getSingleEducator(educator_id))

@educator_blueprint.route("/<string:educator_id>", methods=['PATCH'])
def handleUpdateSingleEducator(educator_id):
    return appContextWrapper(lambda: updateSingleEducator(educator_id))

@educator_blueprint.route("/<string:educator_id>/image", methods=['PATCH'])
def handleUpdateSingleEducatorImage(educator_id):
    return appContextWrapper(lambda: updateSingleEducatorImage(educator_id))

@educator_blueprint.route("/<string:educator_id>", methods=['DELETE'])
def handleDeleteSingleEducator(educator_id):
    return appContextWrapper(lambda: deleteSingleEducator(educator_id))