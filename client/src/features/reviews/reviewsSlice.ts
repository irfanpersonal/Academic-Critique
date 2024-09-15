import {createSlice} from '@reduxjs/toolkit';
import {createReview, deleteReview, getAllReviews, updateReview} from './reviewsThunk';
import {type IReviewsSlice} from '../../@types/reviewsSlice';

const initialState: IReviewsSlice = {
    loaders: {
        getAllReviewsLoading: true,
        createReviewLoading: false,
        editSingleReviewLoading: false,
        deleteSingleReviewLoading: false
    },
    errors: {
        getAllReviewsError: '',
        createReviewError: '',
        editSingleReviewError: '',
        deleteSingleReviewError: ''
    },
    allReviewsData: {
        reviews: [],
        totalReviews: 0,
        numberOfPages: 0,
        searchBoxValues: {
            type_id: '',
            page: '1'
        }
    },
    isEditingReview: ''
};

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        updateSearchBoxValues: (state, action) => {
            state.allReviewsData.searchBoxValues[action.payload.name as keyof typeof state.allReviewsData.searchBoxValues] = action.payload.value;
        },
        changePage: (state, action) => {
            state.allReviewsData.searchBoxValues.page = action.payload;
        },
        setIsEditingReview: (state, action) => {
            state.isEditingReview = action.payload;
        },
        setCreateReviewError: (state, action) => {
            state.errors.createReviewError = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllReviews.pending, (state) => {
            state.loaders.getAllReviewsLoading = true;
        }).addCase(getAllReviews.fulfilled, (state, action) => {
            state.errors.getAllReviewsError = '';
            state.allReviewsData.reviews = action.payload.reviews;
            state.allReviewsData.totalReviews = action.payload.totalReviews;
            state.allReviewsData.numberOfPages = action.payload.numberOfPages;
            state.loaders.getAllReviewsLoading = false;
        }).addCase(getAllReviews.rejected, (state) => {
            state.errors.getAllReviewsError = `Something wen't wrong when trying to get all the reviews...`;
            state.loaders.getAllReviewsLoading = false;
        }).addCase(createReview.pending, (state) => {
            state.loaders.createReviewLoading = true;
        }).addCase(createReview.fulfilled, (state, action) => {
            state.errors.createReviewError = '';
            state.loaders.createReviewLoading = false;
        }).addCase(createReview.rejected, (state, action) => {
            state.errors.createReviewError = action.payload as string;
            state.loaders.createReviewLoading = false;
        }).addCase(updateReview.pending, (state) => {
            state.loaders.editSingleReviewLoading = true;
        }).addCase(updateReview.fulfilled, (state, action) => {
            state.errors.editSingleReviewError = '';
            const review = state.allReviewsData.reviews.find(review => review.id === action.meta.arg.id);
            review!.title = action.payload.title;
            review!.rating = action.payload.rating;
            review!.content = action.payload.content;
            state.loaders.editSingleReviewLoading = false;
        }).addCase(updateReview.rejected, (state, action) => {
            state.errors.editSingleReviewError = action.payload as string;
            state.loaders.editSingleReviewLoading = false;
        }).addCase(deleteReview.pending, (state) => {
            state.loaders.deleteSingleReviewLoading = true;
        }).addCase(deleteReview.fulfilled, (state) => {
            state.errors.deleteSingleReviewError = '';
            state.loaders.deleteSingleReviewLoading = false;
        }).addCase(deleteReview.rejected, (state) => {
            state.loaders.deleteSingleReviewLoading = false;
        })
    }
});

export const {updateSearchBoxValues, changePage, setIsEditingReview, setCreateReviewError} = reviewsSlice.actions;

export default reviewsSlice.reducer;