import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getOverviewData = createAsyncThunk('admin/getOverviewData', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/user/overviewData');
        const data = response.data;
        return data.overviewData;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const generateAdmin = createAsyncThunk('admin/generateAdmin', async(inputData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/user/generate_admin', inputData);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});