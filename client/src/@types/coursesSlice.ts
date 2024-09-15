import {type IEducator} from "./educatorsSlice";
import {type IInstitution} from "./institutionsSlice";

export interface ICourse {
    id: string;
    capacity: number;
    code: string;
    cost: number;
    educator: IEducator;
    educator_id: string;
    format: string;
    institution: IInstitution;
    institution_id: string;
    level: string;
    name: string;
    type: string;
    syllabus: string;
    rating: string;
    createdAt: string;
    updatedAt: string;
}

export interface ILoaders {
    getAllCoursesLoading: boolean;
    createCourseLoading: boolean;
    getSingleCourseLoading: boolean;
    editSingleCourseLoading: boolean;
    deleteSingleCourseLoading: boolean;
}

export interface IErrors {
    createCourseError: string;
    editSingleCourseError: string;
    editSingleCourseSyllabusError: string;
}

export interface IAllCoursesData {
    courses: ICourse[],
    totalCourses: number;
    numberOfPages: number;
    searchBoxValues: {
        name: string;
        educator_id: string;
        institution_id: string;
        page: string;
    }
}

export interface ICoursesSlice {
    loaders: ILoaders;
    errors: IErrors;
    allCoursesData: IAllCoursesData;
    singleCourseData: ICourse | null;
    isEditingCourse: boolean;
    fromEducatorPage: {
        educator_name: string | null
        educator_id: string | null,
        institution_name: string | null,
        institution_id: string | null
    };
}