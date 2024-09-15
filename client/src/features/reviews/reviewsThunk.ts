import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getAllReviews = createAsyncThunk('reviews/getAllReviews', async(type_id: string, thunkAPI) => {
    try {
        const {page} = (thunkAPI.getState() as useSelectorType).reviews.allReviewsData.searchBoxValues;
        const response = await axios.get(`/api/v1/review/${type_id}?page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createReview = createAsyncThunk('reviews/createReview', async(inputData: FormData, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/review/`, inputData);
        const data = response.data;
        thunkAPI.dispatch(getAllReviews((inputData.get('type_id') as string)));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateReview = createAsyncThunk('reviews/updateReview', async(inputData: {id: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/review/${inputData.id}`, inputData.data);
        const data = response.data;
        return data.review;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg); 
    }
});

export const deleteReview = createAsyncThunk('reviews/deleteReview', async(inputData: {reviewId: string, type_id: string}, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/review/${inputData.reviewId}`);
        const data = response.data;
        thunkAPI.dispatch(getAllReviews(inputData.type_id));
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});