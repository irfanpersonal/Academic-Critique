import {createSlice} from '@reduxjs/toolkit';
import {type IEducatorsSlice} from '../../@types/educatorsSlice';
import {getAllEducators, createEducator, getSingleEducator, editSingleEducator, editSingleEducatorImage, deleteSingleEducator} from './educatorsThunk';
import {toast} from 'react-toastify';

const initialState: IEducatorsSlice = {
    loaders: {
        getAllEducatorsLoading: true,
        createEducatorLoading: false,
        getSingleEducatorLoading: true,
        editSingleEducatorLoading: false,
        deleteSingleEducatorLoading: false
    },
    errors: {
        createEducatorError: '',
        editSingleEducatorError: '',
        editSingleEducatorImageError: ''
    },
    singleEducatorData: null,
    allEducatorsData: {
        educators: [],
        totalEducators: 0,
        numberOfPages: 0,
        searchBoxValues: {
            name: '',
            institution_id: '',
            page: '1'
        }
    },
    isEditingEducator: false,
    fromInstitutionPage: {
        id: null,
        name: null
    }
};

const educatorsSlice = createSlice({
    name: 'educators',
    initialState,
    reducers: {
        setFromInstitutionPage: (state, action) => {
            state.fromInstitutionPage = action.payload;
        },
        updateSearchBoxValues: (state, action) => {
            state.allEducatorsData.searchBoxValues[action.payload.name as keyof typeof state.allEducatorsData.searchBoxValues] = action.payload.value;
        },
        changePage: (state, action) => {
            state.allEducatorsData.searchBoxValues.page = action.payload;
        },
        toggleIsEditingEducator: (state) => {
            state.isEditingEducator = !state.isEditingEducator;
        },
        updateEditSingleEducatorLoading: (state, action) => {
            state.loaders.editSingleEducatorLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createEducator.pending, (state) => {
            state.loaders.createEducatorLoading = true;
        }).addCase(createEducator.fulfilled, (state) => {
            state.loaders.createEducatorLoading = false;
        }).addCase(createEducator.rejected, (state, action) => {
            state.errors.createEducatorError = action.payload as string;
            state.loaders.createEducatorLoading = false;
        }).addCase(getAllEducators.pending, (state) => {
            state.loaders.getAllEducatorsLoading = true;
        }).addCase(getAllEducators.fulfilled, (state, action) => {
            state.allEducatorsData.educators = action.payload.educators;
            state.allEducatorsData.totalEducators = action.payload.totalEducators;
            state.allEducatorsData.numberOfPages = action.payload.numberOfPages;
            state.loaders.getAllEducatorsLoading = false;
        }).addCase(getAllEducators.rejected, (state) => {
            state.loaders.getAllEducatorsLoading = false;
        }).addCase(getSingleEducator.pending, (state) => {
            state.loaders.getSingleEducatorLoading = true;
        }).addCase(getSingleEducator.fulfilled, (state, action) => {
            state.singleEducatorData = action.payload;
            state.loaders.getSingleEducatorLoading = false;
        }).addCase(getSingleEducator.rejected, (state) => {
            state.loaders.getSingleEducatorLoading = true;
        }).addCase(editSingleEducator.pending, (state) => {
            state.loaders.editSingleEducatorLoading = true;
        }).addCase(editSingleEducator.fulfilled, (state, action) => {
            state.singleEducatorData = action.payload;
            state.errors.editSingleEducatorError = '';
            state.loaders.editSingleEducatorLoading = false;
        }).addCase(editSingleEducator.rejected, (state, action) => {
            state.errors.editSingleEducatorError = action.payload as string;
            state.loaders.editSingleEducatorLoading = false;
        }).addCase(editSingleEducatorImage.pending, (state) => {
            state.loaders.editSingleEducatorLoading = true;
        }).addCase(editSingleEducatorImage.fulfilled, (state, action) => {
            state.loaders.editSingleEducatorLoading = true;
            state.singleEducatorData!.image = action.payload.educator_image;
        }).addCase(editSingleEducatorImage.rejected, (state, action) => {
            state.errors.editSingleEducatorImageError = action.payload as string;
            state.loaders.editSingleEducatorLoading = true;
        }).addCase(deleteSingleEducator.pending, (state) => {
            state.loaders.deleteSingleEducatorLoading = true;
        }).addCase(deleteSingleEducator.fulfilled, (state) => {
            state.loaders.deleteSingleEducatorLoading = false;
        }).addCase(deleteSingleEducator.rejected, (state, action) => {
            toast.error(action.payload as string);
            state.loaders.deleteSingleEducatorLoading = false;
        });
    }
});

export const {setFromInstitutionPage, updateSearchBoxValues, changePage, toggleIsEditingEducator, updateEditSingleEducatorLoading} = educatorsSlice.actions;

export default educatorsSlice.reducer;