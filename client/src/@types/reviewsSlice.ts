import {type IUser} from "./userSlice";

export interface IReview {
    id: string;
    title: string;
    rating: number;
    content: string;
    type: 'INSTITUTION' | 'EDUCATOR' | 'COURSE';
    type_id: string;
    user: IUser
    user_id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ILoaders {
    getAllReviewsLoading: boolean;
    createReviewLoading: boolean;
    editSingleReviewLoading: boolean;
    deleteSingleReviewLoading: boolean;
}

export interface IErrors {
    getAllReviewsError: string;
    createReviewError: string;
    editSingleReviewError: string;
    deleteSingleReviewError: string;
}

export interface IAllReviewsData {
    reviews: IReview[],
    totalReviews: number;
    numberOfPages: number;
    searchBoxValues: {
        type_id: string;
        page: string;
    }
}

export interface IReviewsSlice {
    loaders: ILoaders;
    errors: IErrors;
    allReviewsData: IAllReviewsData;
    isEditingReview: string;
}