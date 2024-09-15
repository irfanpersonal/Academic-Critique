import {type IInstitution} from "./institutionsSlice";

export interface IEducator {
    id: string;
    name: string;
    description: string;
    email: string;
    image: string;
    institution: IInstitution;
    institution_id: string;
    rating: string;
    status: string;
    department: string;
    course_stats: {
        total_courses: number,
        average_cost: number,
        introductory_count: number,
        intermediate_count: number,
        advanced_count: number,
        graduate_count: number,
        in_person_format_count: number,
        online_format_count: number,
        hybrid_format_count: number,
        self_paced_format_count: number
    };
    createdAt: string;
    updatedAt: string;
}

export interface ILoaders {
    getAllEducatorsLoading: boolean;
    createEducatorLoading: boolean;
    getSingleEducatorLoading: boolean;
    editSingleEducatorLoading: boolean;
    deleteSingleEducatorLoading: boolean;
}

export interface IErrors {
    createEducatorError: string;
    editSingleEducatorError: string;
    editSingleEducatorImageError: string;
}

export interface IAllEducatorsData {
    educators: IEducator[],
    totalEducators: number;
    numberOfPages: number;
    searchBoxValues: {
        name: string;
        institution_id: string;
        page: string;
    }
}

export interface IEducatorsSlice {
    loaders: ILoaders;
    errors: IErrors;
    allEducatorsData: IAllEducatorsData;
    singleEducatorData: IEducator | null;
    isEditingEducator: boolean;
    fromInstitutionPage: {
        id: string | null,
        name: string | null
    };
}