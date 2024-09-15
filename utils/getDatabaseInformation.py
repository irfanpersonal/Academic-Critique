def getDatabaseInformation():
    from app import db
    from app import User as UserModel
    from app import Institution as InstitutionModel
    from app import Educator as EducatorModel
    from app import Course as CourseModel
    from app import Review as ReviewModel
    class Models:
        User = UserModel
        Institution = InstitutionModel
        Educator = EducatorModel
        Course = CourseModel
        Review = ReviewModel
    return (db, Models)