import {createSlice} from '@reduxjs/toolkit';
import {createCourse, getAllCourses, getSingleCourse, editSingleCourse, editSingleCourseSyllabus, deleteSingleCourse} from './coursesThunk';
import {type ICoursesSlice} from '../../@types/coursesSlice';
import {toast} from 'react-toastify';

const initialState: ICoursesSlice = {
    loaders: {
        getAllCoursesLoading: true,
        createCourseLoading: false,
        getSingleCourseLoading: true,
        editSingleCourseLoading: false,
        deleteSingleCourseLoading: false
    },
    errors: {
        createCourseError: '',
        editSingleCourseError: '',
        editSingleCourseSyllabusError: ''
    },
    singleCourseData: null,
    allCoursesData: {
        courses: [],
        totalCourses: 0,
        numberOfPages: 0,
        searchBoxValues: {
            name: '',
            educator_id: '',
            institution_id: '',
            page: '1'
        }
    },
    isEditingCourse: false,
    fromEducatorPage: {
        educator_name: null,
        educator_id: null,
        institution_name: null,
        institution_id: null
    }
};

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setFromEducatorPage: (state, action) => {
            state.fromEducatorPage = action.payload;
        },
        updateSearchBoxValues: (state, action) => {
            state.allCoursesData.searchBoxValues[action.payload.name as keyof typeof state.allCoursesData.searchBoxValues] = action.payload.value;
        },
        changePage: (state, action) => {
            state.allCoursesData.searchBoxValues.page = action.payload;
        },
        toggleIsEditingCourse: (state) => {
            state.isEditingCourse = !state.isEditingCourse;
        },
        updateEditSingleCourseLoading: (state, action) => {
            state.loaders.editSingleCourseLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createCourse.pending, (state) => {
            state.loaders.createCourseLoading = true;
        }).addCase(createCourse.fulfilled, (state) => {
            state.loaders.createCourseLoading = false;
        }).addCase(createCourse.rejected, (state, action) => {
            state.errors.createCourseError = action.payload as string;
            state.loaders.createCourseLoading = false;
        }).addCase(getAllCourses.pending, (state) => {
            state.loaders.getAllCoursesLoading = true;
        }).addCase(getAllCourses.fulfilled, (state, action) => {
            state.allCoursesData.courses = action.payload.courses;
            state.allCoursesData.totalCourses = action.payload.totalCourses;
            state.allCoursesData.numberOfPages = action.payload.numberOfPages;
            state.loaders.getAllCoursesLoading = false;
        }).addCase(getAllCourses.rejected, (state) => {
            state.loaders.getAllCoursesLoading = false;
        }).addCase(getSingleCourse.pending, (state) => {
            state.loaders.getSingleCourseLoading = true;
        }).addCase(getSingleCourse.fulfilled, (state, action) => {
            state.singleCourseData = action.payload;
            state.loaders.getSingleCourseLoading = false;
        }).addCase(getSingleCourse.rejected, (state) => {
            state.loaders.getSingleCourseLoading = true;
        }).addCase(editSingleCourse.pending, (state) => {
            state.loaders.editSingleCourseLoading = true;
        }).addCase(editSingleCourse.fulfilled, (state, action) => {
            state.singleCourseData = action.payload;
            state.errors.editSingleCourseError = '';
            state.loaders.editSingleCourseLoading = false;
        }).addCase(editSingleCourse.rejected, (state, action) => {
            state.errors.editSingleCourseError = action.payload as string;
            state.loaders.editSingleCourseLoading = false;
        }).addCase(editSingleCourseSyllabus.pending, (state) => {
            state.loaders.editSingleCourseLoading = true;
        }).addCase(editSingleCourseSyllabus.fulfilled, (state, action) => {
            state.errors.editSingleCourseSyllabusError = '';
            state.loaders.editSingleCourseLoading = true;
            state.singleCourseData!.syllabus = action.payload.course_syllabus;
        }).addCase(editSingleCourseSyllabus.rejected, (state, action) => {
            state.errors.editSingleCourseSyllabusError = action.payload as string;
            state.loaders.editSingleCourseLoading = true;
        }).addCase(deleteSingleCourse.pending, (state) => {
            state.loaders.deleteSingleCourseLoading = true;
        }).addCase(deleteSingleCourse.fulfilled, (state) => {
            state.loaders.deleteSingleCourseLoading = false;
        }).addCase(deleteSingleCourse.rejected, (state, action) => {
            toast.error(action.payload as string);
            state.loaders.deleteSingleCourseLoading = false;
        });
    }
});

export const {setFromEducatorPage, updateSearchBoxValues, changePage, toggleIsEditingCourse, updateEditSingleCourseLoading} = coursesSlice.actions;

export default coursesSlice.reducer;