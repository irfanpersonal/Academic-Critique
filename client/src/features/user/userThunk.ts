import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const showCurrentUser = createAsyncThunk('user/showCurrentUser', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/user/showCurrentUser');
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const registerUser = createAsyncThunk('user/registerUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/register', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const loginUser = createAsyncThunk('user/loginUser', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/login', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getProfileData = createAsyncThunk('user/getProfileData', async(_, thunkAPI) => {
    try {
        const response = await axios.get('/api/v1/user/showCurrentUser');
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const logoutUser = createAsyncThunk('user/logoutUser', async(_, thunkAPI) => {
    try {
        const response = await axios.post('/api/v1/auth/logout');
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updatePassword = createAsyncThunk('/user/updatePassword', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updatePassword', userData);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async(userData: FormData, thunkAPI) => {
    try {
        const response = await axios.patch('/api/v1/user/updateProfile', userData);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getAllUsers = createAsyncThunk('user/getAllUsers', async(_, thunkAPI) => {
    try {
        const {username, country, page} = (thunkAPI.getState() as useSelectorType).user.allUsersData.searchBoxValues;
        const response = await axios.get(`/api/v1/user?username=${username}&country=${country}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleUser = createAsyncThunk('user/getSingleUser', async(username: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/user/${username}`);
        const data = response.data;
        return data.user;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});