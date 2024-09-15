import {createAsyncThunk} from '@reduxjs/toolkit';
import {type useSelectorType} from '../../store';
import axios from 'axios';

export const getAllCourses = createAsyncThunk('courses/getAllCourses', async(_, thunkAPI) => {
    try {
        const {name, educator_id, institution_id, page} = (thunkAPI.getState() as useSelectorType).courses.allCoursesData.searchBoxValues;
        const response = await axios.get(`/api/v1/course/?name=${name}&institution_id=${institution_id}&educator_id=${educator_id}&page=${page}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const createCourse = createAsyncThunk('courses/createCourse', async(inputData: FormData, thunkAPI) => {
    try {
        const response = await axios.post(`/api/v1/course/`, inputData);
        const data = response.data;
        return data.course;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const getSingleCourse = createAsyncThunk('courses/getSingleCourse', async(courseId: string, thunkAPI) => {
    try {
        const response = await axios.get(`/api/v1/course/${courseId}`);
        const data = response.data;
        return data.course;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSingleCourse = createAsyncThunk('courses/editSingleCourse', async(inputData: {course_id: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/course/${inputData.course_id}`, inputData.data);
        const data = response.data;
        return data.course;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const editSingleCourseSyllabus = createAsyncThunk('courses/editSingleCourseSyllabus', async(inputData: {course_id: string, data: FormData}, thunkAPI) => {
    try {
        const response = await axios.patch(`/api/v1/course/${inputData.course_id}/syllabus`, inputData.data);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

export const deleteSingleCourse = createAsyncThunk('courses/deleteSingleCourse', async(course_id: string, thunkAPI) => {
    try {
        const response = await axios.delete(`/api/v1/course/${course_id}`);
        const data = response.data;
        return data;
    }
    catch(error: any) {
        return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});