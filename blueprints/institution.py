import flask
from controllers.institution import getAllInstitutions, createInstitution, getSingleInstitution, updateSingleInstitution, updateSingleInstitutionImage, deleteSingleInstitution
from utils.appContextWrapper import appContextWrapper

institution_blueprint = flask.Blueprint(
    name = "institution", 
    import_name = __name__, 
    url_prefix = "/api/v1/institution"
)

@institution_blueprint.route("/", methods=['GET'])
def handleGetAllInstitutions():
    return appContextWrapper(getAllInstitutions)

@institution_blueprint.route("/", methods=['POST'])
def handleInstitutionCreation():
    return appContextWrapper(createInstitution)

@institution_blueprint.route("/<string:institution_id>", methods=['GET'])
def handleGetSingleInstitution(institution_id):
    return appContextWrapper(lambda: getSingleInstitution(institution_id))

@institution_blueprint.route("/<string:institution_id>", methods=['PATCH'])
def handleUpdateSingleInstitution(institution_id):
    return appContextWrapper(lambda: updateSingleInstitution(institution_id))

@institution_blueprint.route("/<string:institution_id>/image", methods=['PATCH'])
def handleUpdateSingleInstitutionImage(institution_id):
    return appContextWrapper(lambda: updateSingleInstitutionImage(institution_id))

@institution_blueprint.route("/<string:institution_id>", methods=['DELETE'])
def handleDeleteSingleInstitution(institution_id):
    return appContextWrapper(lambda: deleteSingleInstitution(institution_id))