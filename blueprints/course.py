import flask
from controllers.course import getAllCourses, createCourse, getSingleCourse, updateSingleCourse, updateSingleCourseSyllabus, deleteSingleCourse
from utils.appContextWrapper import appContextWrapper
 
course_blueprint = flask.Blueprint(
    name = "course", 
    import_name = __name__, 
    url_prefix = "/api/v1/course"
)

@course_blueprint.route("/", methods=['GET'])
def handleGetAllCourses():
    return appContextWrapper(getAllCourses)

@course_blueprint.route("/", methods=['POST'])
def handleCourseCreation():
    return appContextWrapper(createCourse)

@course_blueprint.route("/<string:course_id>", methods=['GET'])
def handleGetSingleCourse(course_id):
    return appContextWrapper(lambda: getSingleCourse(course_id))

@course_blueprint.route("/<string:course_id>", methods=['PATCH'])
def handleUpdateSingleCourse(course_id):
    return appContextWrapper(lambda: updateSingleCourse(course_id))

@course_blueprint.route("/<string:course_id>/syllabus", methods=['PATCH'])
def handleUpdateSingleCourseSyllabus(course_id):
    return appContextWrapper(lambda: updateSingleCourseSyllabus(course_id))

@course_blueprint.route("/<string:course_id>", methods=['DELETE'])
def handleDeleteSingleCourse(course_id):
    return appContextWrapper(lambda: deleteSingleCourse(course_id))