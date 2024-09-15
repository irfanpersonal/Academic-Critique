import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getAllEducators = createAsyncThunk('educators/getAllEducators', async(_, thunkAPI) => {
    try {
        const {name, institution_id, page} = (thunkAPI.getState() as useSelectorType).educators.allEducatorsData.searchBoxValues;
        const response = await axios.get(`/api/v1/educator/?name=${name}&institution_id=${institution_id}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createEducator = createAsyncThunk('educators/createEducator', async(inputData: FormData, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/educator/`, inputData);
        const data = response.data;
        return data.educator;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleEducator = createAsyncThunk('educators/getSingleEducator', async(educatorId: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/educator/${educatorId}`);
        const data = response.data;
        return data.educator;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSingleEducator = createAsyncThunk('educators/editSingleEducator', async(inputData: {educator_id: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/educator/${inputData.educator_id}`, inputData.data);
        const data = response.data;
        return data.educator;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSingleEducatorImage = createAsyncThunk('educators/editSingleEducatorImage', async(inputData: {educator_id: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/educator/${inputData.educator_id}/image`, inputData.data);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleEducator = createAsyncThunk('educators/deleteSingleEducator', async(educatorId: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/educator/${educatorId}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});