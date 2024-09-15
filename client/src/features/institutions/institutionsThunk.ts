import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getAllInstitutions = createAsyncThunk('institutions/getAllInstitutions', async(_, thunkAPI) => {
    try {
        const {name, type, ratingMin, ratingMax, sizeMin, sizeMax, tuitionMin, tuitionMax, accreditationStatus, acceptanceRate, country, sort, page} = (thunkAPI.getState() as useSelectorType).institutions.allInstitutionsData.searchBoxValues;
        const response = await axios.get(`/api/v1/institution/?name=${name}&type=${type}&ratingMin=${ratingMin}&ratingMax=${ratingMax}&sizeMin=${sizeMin}&sizeMax=${sizeMax}&tuitionMin=${tuitionMin}&tuitionMax=${tuitionMax}&accreditationStatus=${accreditationStatus}&acceptanceRate=${acceptanceRate}&country=${country}&sort=${sort}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createInstitution = createAsyncThunk('institution/createInstitution', async(inputData: FormData, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/institution/`, inputData);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleInstitution = createAsyncThunk('institution/getSingleInstitution', async(institutionId: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/institution/${institutionId}`);
        const data = response.data;
        return data.institution;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSingleInstitution = createAsyncThunk('institution/editSingleInstitution', async(inputData: {institutionId: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/institution/${inputData.institutionId}`, inputData.data);
        const data = response.data;
        return data.institution;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSingleInstitutionImage = createAsyncThunk('institution/editSingleInstitutionImage', async(inputData: {institutionId: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/institution/${inputData.institutionId}/image`, inputData.data);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleInstitution = createAsyncThunk('institution/deleteSingleInstitution', async(institutionId: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/institution/${institutionId}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});